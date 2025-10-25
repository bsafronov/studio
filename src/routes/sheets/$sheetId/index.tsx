import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
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
import { orpc, type RouterOutputs } from "@/orpc/client";

export const Route = createFileRoute("/sheets/$sheetId/")({
	component: RouteComponent,
	loader: async ({ context: { queryClient }, params: { sheetId } }) => {
		await Promise.all([
			queryClient.prefetchQuery(
				orpc.sheet.getSheetById.queryOptions({
					input: { sheetId: sheetId },
				}),
			),
			queryClient.prefetchQuery(
				orpc.sheet.getColumns.queryOptions({
					input: { sheetId },
				}),
			),
			queryClient.prefetchQuery(
				orpc.sheet.getRows.queryOptions({
					input: { sheetId },
				}),
			),
		]);
	},
	validateSearch: z.object({
		redirectUrl: z.string().optional(),
		page: z.number().optional().catch(1),
		limit: z.number().optional().catch(20),
	}),
});

type SheetRow = RouterOutputs["sheet"]["getRows"][number];
const th = createColumnHelper<SheetRow>();

const baseColumns = [
	th.accessor("createdBy.username", { header: "Создал" }),
	th.accessor("createdAt", {
		header: "Дата создания",
		cell: ({ getValue }) => format(getValue(), "dd.MM.yyyy HH:mm"),
	}),
	th.accessor("updatedBy.username", { header: "Изменил" }),
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
		}) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon-sm" variant="ghost">
						<LuEllipsis />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem asChild>
						<Link to="/sheets/$sheetId/$rowId" params={{ sheetId, rowId: id }}>
							Изменить
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
		size: 40,
	}),
];

function RouteComponent() {
	const { sheetId } = Route.useParams();
	const { data: sheet } = useSuspenseQuery(
		orpc.sheet.getSheetById.queryOptions({
			input: { sheetId },
		}),
	);
	const { data: dynamicColumns } = useSuspenseQuery(
		orpc.sheet.getColumns.queryOptions({
			input: { sheetId },
		}),
	);
	const { data: rows } = useSuspenseQuery(
		orpc.sheet.getRows.queryOptions({
			input: { sheetId },
		}),
	);

	const columns = useMemo(() => {
		const cols = dynamicColumns.map((column) => {
			const { id, name } = column;
			return {
				id,
				header: name,
				cell: ({
					row: {
						original: { data },
					},
				}) => {
					const value = data[id];
					return value;
				},
			} satisfies ColumnDef<SheetRow>;
		});
		return [...cols, ...baseColumns];
	}, [dynamicColumns]);

	const table = useReactTable({
		data: rows,
		columns,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: "onChange",
	});

	return (
		<>
			<div className="flex justify-between items-center">
				<h5 className="font-semibold text-xl">{sheet.name}</h5>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size="icon">
							<LucideSettings2 />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem asChild>
							<Link to="/sheets/$sheetId/new" params={{ sheetId }}>
								<LuPencil />
								Добавить запись
							</Link>
						</DropdownMenuItem>
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
			<AppSheet table={table} />
		</>
	);
}
