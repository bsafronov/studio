import { useNavigate } from "@tanstack/react-router";
import {
	type ColumnFilter,
	type ColumnSort,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type OnChangeFn,
	type TableOptions,
	type TableState,
	useReactTable,
} from "@tanstack/react-table";

type SheetState = {
	sorting: ColumnSort[];
	columnFilters: ColumnFilter[];
	limit: number;
	page: number;
};

type SheetOptions<TData> = Pick<TableOptions<TData>, "columns" | "data"> &
	SheetState;

export function useSheet<TData>({
	columns,
	data,
	sorting,
	columnFilters,
	limit,
	page,
}: SheetOptions<TData>) {
	const navigate = useNavigate();

	const state = {
		columnFilters,
		sorting,
		pagination: {
			pageIndex: Math.max(page - 1, 0),
			pageSize: limit,
		},
	} satisfies Partial<TableState>;

	const handleStateChange = <T extends (typeof state)[keyof typeof state]>(
		state: T,
		searchFn: (state: T) => Partial<SheetState>,
	) => {
		const handler: OnChangeFn<T> = (updater) => {
			const newState = typeof updater === "function" ? updater(state) : updater;
			console.log({ newState });
			navigate({
				to: ".",
				search: (prev) => ({
					...prev,
					...searchFn(newState),
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
		state,
		initialState: {
			columnPinning: {
				right: ["actions"],
			},
		},
		onSortingChange: handleStateChange(state.sorting, (sorting) => ({
			sorting,
		})),
		onColumnFiltersChange: handleStateChange(
			state.columnFilters,
			(columnFilters) => ({ columnFilters }),
		),
		onPaginationChange: handleStateChange(state.pagination, (pagination) => ({
			page: pagination.pageIndex + 1,
			limit: pagination.pageSize,
		})),
		manualSorting: data.length >= limit,
		manualFiltering: true,
		manualPagination: true,
	});
}
