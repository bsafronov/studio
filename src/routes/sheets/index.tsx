import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { AppSheet } from "@/components/app-sheet";
import { orpc, type RouterOutputs } from "@/orpc/client";

export const Route = createFileRoute("/sheets/")({
	component: RouteComponent,
	loader: ({ context }) => {
		context.queryClient.prefetchQuery(orpc.sheet.getSheets.queryOptions());
	},
});

const th = createColumnHelper<RouterOutputs["sheet"]["getSheets"][number]>();
const columns = [
	th.accessor("name", {
		header: "Название",
		cell: ({ row: { original } }) => (
			<Link
				to="/sheets/$sheetId"
				params={{ sheetId: original.id }}
				className="text-blue-500 hover:text-blue-400"
			>
				{original.name}
			</Link>
		),
	}),
	th.accessor("createdBy.username", {
		header: "Создал",
	}),
	th.accessor("createdAt", {
		header: "Дата создания",
		cell: ({ getValue }) => format(getValue(), "dd.MM.yyyy HH:mm"),
	}),
	th.accessor("updatedBy.username", {
		header: "Изменил",
	}),
	th.accessor("updatedAt", {
		header: "Дата изменения",
		cell: ({ getValue }) => {
			const updatedAt = getValue();
			if (!updatedAt) return;
			return format(updatedAt, "dd.MM.yyyy HH:mm");
		},
	}),
];

function RouteComponent() {
	const { data: sheets } = useSuspenseQuery(
		orpc.sheet.getSheets.queryOptions(),
	);

	const table = useReactTable({
		data: sheets,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return <AppSheet table={table} />;
}
