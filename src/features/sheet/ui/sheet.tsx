import { flexRender, type Table as TTable } from "@tanstack/react-table";
import { LuChevronDown, LuChevronsUpDown, LuChevronUp } from "react-icons/lu";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

export function Sheet<TData>({ table, title, description }: SheetProps<TData>) {
	const hasHeader = title || description;
	return (
		<Card>
			{hasHeader && (
				<CardHeader>
					{title && <CardTitle>{title}</CardTitle>}
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
			)}
			<Table>
				<TableHeader>
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
									style={{
										width: header.getSize(),
									}}
									onClick={header.column.getToggleSortingHandler()}
								>
									{header.column.getCanSort() && (
										<HeaderSortingIcon
											direction={header.column.getIsSorted()}
										/>
									)}
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
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
									style={{
										width: cell.column.getSize(),
									}}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Card>
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
				"inline mr-2 text-muted-foreground",
				direction && "text-primary",
			)}
		/>
	);
};
