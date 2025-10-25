import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import z from "zod";
import { sheetRowsTable } from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const deleteRow = authProcedure
	.input(z.object({ rowId: z.string() }))
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
