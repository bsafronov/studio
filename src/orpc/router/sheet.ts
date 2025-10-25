import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { sheetColumnsTable, sheetRowsTable, sheetsTable } from "@/db/schema";
import { authProcedure, baseProcedure } from "../utils";

const CreateSheetSchema = createInsertSchema(sheetsTable).pick({
	name: true,
});

const createSheet = authProcedure
	.input(CreateSheetSchema)
	.handler(async ({ context, input }) => {
		const [sheet] = await context.db
			.insert(sheetsTable)
			.values({
				name: input.name,
				createdById: context.user.id,
			})
			.returning();

		return sheet;
	});

const DeleteSheetSchema = z.object({ sheetId: z.string() });
const deleteSheet = authProcedure
	.input(DeleteSheetSchema)
	.handler(async ({ context, input }) => {
		const sheet = await context.db.query.sheetsTable.findFirst({
			where: eq(sheetsTable.id, input.sheetId),
		});

		if (!sheet) {
			throw new ORPCError("NOT_FOUND");
		}

		if (sheet.createdById !== context.user.id) {
			throw new ORPCError("UNAUTHORIZED");
		}

		await context.db
			.delete(sheetsTable)
			.where(eq(sheetsTable.id, input.sheetId));
	});

const UpdateSheetSchema = z
	.object({
		sheetId: z.string(),
	})
	.and(createUpdateSchema(sheetsTable).pick({ name: true }));

const updateSheet = authProcedure
	.input(UpdateSheetSchema)
	.handler(async ({ context, input }) => {
		const sheet = await context.db.query.sheetsTable.findFirst({
			where: eq(sheetsTable.id, input.sheetId),
		});

		if (!sheet) {
			throw new ORPCError("NOT_FOUND");
		}

		if (sheet.createdById !== context.user.id) {
			throw new ORPCError("UNAUTHORIZED");
		}

		await context.db
			.update(sheetsTable)
			.set({
				name: input.name,
				updatedAt: new Date(),
				updatedById: context.user.id,
			})
			.where(eq(sheetsTable.id, input.sheetId));
	});

const getSheets = baseProcedure.handler(async ({ context }) => {
	return context.db.query.sheetsTable.findMany({
		with: {
			workspace: {
				columns: {
					id: true,
					name: true,
				},
			},
			createdBy: {
				columns: {
					id: true,
					username: true,
				},
			},
			updatedBy: {
				columns: {
					id: true,
					username: true,
				},
			},
		},
	});
});

const GetSheetByIdSchema = z.object({ sheetId: z.string() });
const getSheetById = baseProcedure
	.input(GetSheetByIdSchema)
	.handler(async ({ context, input }) => {
		const sheet = await context.db.query.sheetsTable.findFirst({
			where: eq(sheetsTable.id, input.sheetId),
		});

		if (!sheet) {
			throw new ORPCError("NOT_FOUND");
		}

		return sheet;
	});

const CreateColumnSchema = createInsertSchema(sheetColumnsTable).pick({
	name: true,
	required: true,
	sheetId: true,
	type: true,
	meta: true,
});

const createColumn = authProcedure
	.input(CreateColumnSchema)
	.handler(async ({ context, input }) => {
		const { name, sheetId, meta, required, type } = input;
		const sheet = await context.db.query.sheetsTable.findFirst({
			where: eq(sheetsTable.id, sheetId),
		});

		if (!sheet) {
			throw new ORPCError("NOT_FOUND");
		}

		if (sheet.createdById !== context.user.id) {
			throw new ORPCError("UNAUTHORIZED");
		}

		const [column] = await context.db
			.insert(sheetColumnsTable)
			.values({
				createdById: context.user.id,
				name,
				sheetId,
				meta,
				required,
				type,
			})
			.returning();

		return column;
	});

const DeleteColumnSchema = z.object({ columnId: z.string() });
const deleteColumn = authProcedure
	.input(DeleteColumnSchema)
	.handler(async ({ context, input }) => {
		const column = await context.db.query.sheetColumnsTable.findFirst({
			where: eq(sheetColumnsTable.id, input.columnId),
		});

		if (!column) {
			throw new ORPCError("NOT_FOUND");
		}

		if (column.createdById !== context.user.id) {
			throw new ORPCError("UNAUTHORIZED");
		}

		await context.db
			.delete(sheetColumnsTable)
			.where(eq(sheetColumnsTable.id, input.columnId));
	});

const UpdateColumnSchema = z
	.object({
		columnId: z.string(),
	})
	.and(
		createUpdateSchema(sheetColumnsTable).pick({
			name: true,
			meta: true,
			required: true,
		}),
	);

const updateColumn = authProcedure
	.input(UpdateColumnSchema)
	.handler(async ({ context, input }) => {
		const { columnId, meta, name, required } = input;
		const column = await context.db.query.sheetColumnsTable.findFirst({
			where: eq(sheetColumnsTable.id, columnId),
		});

		if (!column) {
			throw new ORPCError("NOT_FOUND");
		}

		if (column.createdById !== context.user.id) {
			throw new ORPCError("UNAUTHORIZED");
		}

		const [updatedColumn] = await context.db
			.update(sheetColumnsTable)
			.set({
				name,
				meta,
				required,
				updatedAt: new Date(),
				updatedById: context.user.id,
			})
			.where(eq(sheetColumnsTable.id, columnId))
			.returning();
		return updatedColumn;
	});

const GetColumnsSchema = z.object({ sheetId: z.string() });
const getColumns = baseProcedure
	.input(GetColumnsSchema)
	.handler(async ({ context, input }) => {
		const columns = await context.db.query.sheetColumnsTable.findMany({
			where: eq(sheetColumnsTable.sheetId, input.sheetId),
		});
		return columns;
	});

const CreateRowSchema = createInsertSchema(sheetRowsTable).pick({
	data: true,
	sheetId: true,
	meta: true,
});
const createRow = authProcedure
	.input(CreateRowSchema)
	.handler(async ({ context, input }) => {
		const { data, sheetId, meta } = input;
		const sheet = await context.db.query.sheetsTable.findFirst({
			where: eq(sheetsTable.id, sheetId),
		});

		if (!sheet) {
			throw new ORPCError("NOT_FOUND");
		}

		if (sheet.createdById !== context.user.id) {
			throw new ORPCError("UNAUTHORIZED");
		}

		const [row] = await context.db
			.insert(sheetRowsTable)
			.values({
				data,
				sheetId,
				meta,
				createdById: context.user.id,
			})
			.returning();
		return row;
	});

const DeleteRowSchema = z.object({ rowId: z.string() });
const deleteRow = authProcedure
	.input(DeleteRowSchema)
	.handler(async ({ context, input }) => {
		const row = await context.db.query.sheetRowsTable.findFirst({
			where: eq(sheetRowsTable.id, input.rowId),
		});

		if (!row) {
			throw new ORPCError("NOT_FOUND");
		}

		if (row.createdById !== context.user.id) {
			throw new ORPCError("UNAUTHORIZED");
		}

		await context.db
			.delete(sheetRowsTable)
			.where(eq(sheetRowsTable.id, input.rowId));
	});

const UpdateRowSchema = z
	.object({
		rowId: z.string(),
	})
	.and(
		createUpdateSchema(sheetRowsTable).pick({
			data: true,
			meta: true,
		}),
	);
const updateRow = authProcedure
	.input(UpdateRowSchema)
	.handler(async ({ context, input }) => {
		const { rowId, data, meta } = input;
		const row = await context.db.query.sheetRowsTable.findFirst({
			where: eq(sheetRowsTable.id, rowId),
		});

		if (!row) {
			throw new ORPCError("NOT_FOUND");
		}

		if (row.createdById !== context.user.id) {
			throw new ORPCError("UNAUTHORIZED");
		}

		const [updatedRow] = await context.db
			.update(sheetRowsTable)
			.set({
				data,
				meta,
				updatedAt: new Date(),
				updatedById: context.user.id,
			})
			.where(eq(sheetRowsTable.id, rowId))
			.returning();
		return updatedRow;
	});

const GetRowsSchema = z.object({ sheetId: z.string() });
const getRows = baseProcedure
	.input(GetRowsSchema)
	.handler(async ({ context, input }) => {
		const rows = await context.db.query.sheetRowsTable.findMany({
			where: eq(sheetRowsTable.sheetId, input.sheetId),
			with: {
				createdBy: true,
				updatedBy: true,
			},
		});
		return rows;
	});

export const sheet = {
	createSheet,
	deleteSheet,
	updateSheet,
	getSheets,
	getSheetById,

	createColumn,
	deleteColumn,
	updateColumn,
	getColumns,

	createRow,
	deleteRow,
	updateRow,
	getRows,
};
