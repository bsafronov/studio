import {
	type Column,
	flexRender,
	type Table as TTable,
} from "@tanstack/react-table";
import type { CSSProperties } from "react";
import {
	LuChevronDown,
	LuChevronLeft,
	LuChevronRight,
	LuChevronsLeft,
	LuChevronsRight,
	LuChevronsUpDown,
	LuChevronUp,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type SheetProps<TData> = {
	table: TTable<TData>;
	title?: string;
	description?: string;
};

const getCommonPinningStyles = <TData,>(
	column: Column<TData>,
): CSSProperties => {
	const isPinned = column.getIsPinned();
	const isLastLeftPinnedColumn =
		isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinnedColumn =
		isPinned === "right" && column.getIsFirstColumn("right");

	return {
		boxShadow: isLastLeftPinnedColumn
			? "-4px 0 1px -4px var(--border) inset"
			: isFirstRightPinnedColumn
				? "4px 0 1px -4px var(--border) inset"
				: undefined,
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		opacity: isPinned ? 0.95 : 1,
		position: isPinned ? "sticky" : "relative",
		width: column.getSize(),
		zIndex: isPinned ? 1 : 0,
	};
};

export function Sheet<TData>({ table }: SheetProps<TData>) {
	return (
		<div className="relative -m-4 grow flex flex-col overflow-hidden">
			<Table>
				<TableHeader className="sticky top-0">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									colSpan={header.colSpan}
									className={cn(
										"relative group",
										header.column.getCanSort() && "cursor-pointer",
									)}
									style={getCommonPinningStyles(header.column)}
									onClick={header.column.getToggleSortingHandler()}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
									{header.column.getCanSort() && (
										<HeaderSortingIcon
											direction={header.column.getIsSorted()}
										/>
									)}

									{header.column.getCanResize() && (
										// biome-ignore lint/a11y/noStaticElementInteractions: ignore
										<div
											onMouseDown={header.getResizeHandler()}
											onTouchStart={header.getResizeHandler()}
											className={cn(
												"absolute right-0 top-1/2 h-8 -translate-y-1/2 w-1 opacity-0 group-hover:opacity-100 bg-muted transition-all cursor-col-resize select-none touch-none rounded-full hover:bg-muted-foreground",
												header.column.getIsResizing() &&
													"bg-blue-500 opacity-100 hover:bg-blue-500",
											)}
										/>
									)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id} className="hover:bg-muted/50">
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									style={getCommonPinningStyles(cell.column)}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex justify-end px-4 gap-4 items-center sticky bottom-0 w-full">
				<span>
					Страница {table.getState().pagination.pageIndex + 1} из{" "}
					{table.getPageCount().toLocaleString()}
				</span>
				<ButtonGroup>
					<Button
						size={"icon-sm"}
						variant="outline"
						onClick={table.firstPage}
						disabled={!table.getCanPreviousPage()}
					>
						<LuChevronsLeft />
					</Button>
					<Button
						size={"icon-sm"}
						variant="outline"
						onClick={table.previousPage}
						disabled={!table.getCanPreviousPage()}
					>
						<LuChevronLeft />
					</Button>
					<Button
						size={"icon-sm"}
						variant="outline"
						onClick={table.nextPage}
						disabled={!table.getCanNextPage()}
					>
						<LuChevronRight />
					</Button>
					<Button
						size={"icon-sm"}
						variant="outline"
						onClick={table.lastPage}
						disabled={!table.getCanNextPage()}
					>
						<LuChevronsRight />
					</Button>
				</ButtonGroup>
				<div className="flex items-center gap-1 p-4 sticky bottom-0">
					Показывать по
					<Select
						value={table.getState().pagination.pageSize.toString()}
						onValueChange={(value) => table.setPageSize(+value)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent align="end">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={pageSize.toString()}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}

const HeaderSortingIcon = ({
	direction,
}: {
	direction: "asc" | "desc" | false;
}) => {
	const Icon = !direction
		? LuChevronsUpDown
		: direction === "asc"
			? LuChevronUp
			: LuChevronDown;

	return (
		<Icon
			className={cn(
				"inline ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-[opacity,color]",
				direction && "text-primary opacity-100 ",
			)}
		/>
	);
};
