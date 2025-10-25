import { flexRender, type Table as TTable } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

type AppSheetProps<TData> = {
	table: TTable<TData>;
	title?: string;
	description?: string;
};

export function AppSheet<TData>({
	table,
	title,
	description,
}: AppSheetProps<TData>) {
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
									className="relative group"
									style={{
										width: header.getSize(),
									}}
								>
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
