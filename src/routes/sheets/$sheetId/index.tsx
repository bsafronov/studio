import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { LucideSettings2 } from "lucide-react";
import { useMemo } from "react";
import {
	LuColumns2,
	LuEllipsis,
	LuLogs,
	LuPencil,
	LuSettings,
} from "react-icons/lu";
import z from "zod";
import { AppSheet } from "@/components/app-sheet";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { confirmDialog } from "@/features/alert-dialog";
import { SheetSearchSchema, useSheet } from "@/features/sheet";
import { orpc, type RouterOutputs } from "@/orpc/client";

export const Route = createFileRoute("/sheets/$sheetId/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params: { sheetId } }) => {
		await Promise.all([
			queryClient.prefetchQuery(
				orpc.sheet.sheet.queryOptions({
					input: { sheetId: sheetId },
				}),
			),
			queryClient.prefetchQuery(
				orpc.sheet.columnList.queryOptions({
					input: { sheetId },
				}),
			),
			queryClient.prefetchQuery(
				orpc.sheet.rowList.queryOptions({
					input: { sheetId },
				}),
			),
		]);
	},
	validateSearch: z.object({
		redirectUrl: z.string().optional(),
		...SheetSearchSchema.shape,
	}),
});

type SheetRow = RouterOutputs["sheet"]["rowList"][number];
const th = createColumnHelper<SheetRow>();

const baseColumns = [
	th.accessor("createdBy.username", { header: "Создал" }),
	th.accessor("createdAt", {
		header: "Дата создания",
		cell: ({ getValue }) => format(getValue(), "dd.MM.yyyy HH:mm"),
	}),
	th.accessor("updatedBy.username", {
		header: "Изменил",
		cell: ({ getValue }) => getValue() ?? null,
	}),
	th.accessor("updatedAt", {
		header: "Дата изменения",
		cell: ({ getValue }) => {
			const updatedAt = getValue();
			if (!updatedAt) return;
			return format(updatedAt, "dd.MM.yyyy HH:mm");
		},
	}),
	th.display({
		id: "actions",
		cell: ({
			row: {
				original: { id, sheetId },
			},
		}) => <ActionMenu rowId={id} sheetId={sheetId} />,
		size: 40,
	}),
];

function ActionMenu(params: { sheetId: string; rowId: string }) {
	const qc = useQueryClient();
	const { mutateAsync: deleteRow } = useMutation(
		orpc.sheet.deleteRow.mutationOptions({
			onSuccess: () => {
				qc.invalidateQueries({
					queryKey: orpc.sheet.rowList.queryKey({
						input: { sheetId: params.sheetId },
					}),
				});
			},
		}),
	);

	const handleDelete = () => {
		confirmDialog({
			onConfirm: () => deleteRow({ rowId: params.rowId }),
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon-sm" variant="ghost">
					<LuEllipsis />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<Link to="/sheets/$sheetId/$rowId" params={params}>
						Изменить
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleDelete} variant="destructive">
					Удалить
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function RouteComponent() {
	const search = Route.useSearch();
	const { sheetId } = Route.useParams();
	const { data: sheet } = useSuspenseQuery(
		orpc.sheet.sheet.queryOptions({
			input: { sheetId },
		}),
	);
	const { data: dynamicColumns } = useSuspenseQuery(
		orpc.sheet.columnList.queryOptions({
			input: { sheetId },
		}),
	);
	const { data: rows } = useSuspenseQuery(
		orpc.sheet.rowList.queryOptions({
			input: { sheetId },
		}),
	);

	const columns = useMemo(() => {
		const cols = dynamicColumns.map((column) => {
			const { id, name } = column;
			return {
				id,
				accessorFn: ({ data }) => data[id],
				header: name,
				cell: ({
					row: {
						original: { data },
					},
				}) => {
					const value = data[id];
					return value ?? null;
				},
			} satisfies ColumnDef<SheetRow>;
		});
		return [...cols, ...baseColumns];
	}, [dynamicColumns]);

	const table = useSheet({
		columns,
		data: rows,
		...search,
	});

	return (
		<>
			<div className="flex justify-between items-center">
				<h5 className="font-semibold text-xl">{sheet.name}</h5>
				<div className="flex items-center gap-2">
					<Button asChild size="icon">
						<Link to="/sheets/$sheetId/new" params={{ sheetId }}>
							<LuPencil />
						</Link>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost">
								<LucideSettings2 />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild></DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/sheets/$sheetId/columns/new" params={{ sheetId }}>
									<LuColumns2 />
									Добавить столбец
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/sheets/$sheetId/columns" params={{ sheetId }}>
									<LuColumns2 />
									Столбцы
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/sheets/$sheetId/logs" params={{ sheetId }}>
									<LuLogs />
									Логи
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/sheets/$sheetId/settings" params={{ sheetId }}>
									<LuSettings />
									Настройки
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<AppSheet table={table} />
		</>
	);
}
