import { useNavigate } from "@tanstack/react-router";
import {
	type ColumnFilter,
	type ColumnSort,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type OnChangeFn,
	type TableOptions,
	useReactTable,
} from "@tanstack/react-table";

type SheetState = {
	sorting: ColumnSort[];
	columnFilters: ColumnFilter[];
	limit: number;
	page: number;
};
type UpdaterState = SheetState[keyof SheetState];

type SheetOptions<TData> = Pick<TableOptions<TData>, "columns" | "data"> &
	SheetState;

export function useSheet<TData>({
	columns,
	data,
	sorting,
	columnFilters,
	limit,
}: SheetOptions<TData>) {
	const navigate = useNavigate();

	const handleStateChange = <T extends UpdaterState>(
		state: T,
		key: keyof SheetState,
	) => {
		const handler: OnChangeFn<T> = (updater) => {
			const newState = typeof updater === "function" ? updater(state) : updater;

			navigate({
				to: ".",
				search: (prev) => ({
					...prev,
					[key]: newState,
				}),
			});
		};

		return handler;
	};

	return useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		columnResizeMode: "onChange",
		state: {
			sorting,
			columnFilters,
		},
		onSortingChange: handleStateChange(sorting, "sorting"),
		onColumnFiltersChange: handleStateChange(columnFilters, "columnFilters"),
		manualSorting: data.length >= limit,
		manualFiltering: true,
	});
}
