import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { sheetRowsTable } from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const updateRow = authProcedure
	.input(
		z
			.object({
				rowId: z.string(),
			})
			.and(
				createUpdateSchema(sheetRowsTable).pick({
					data: true,
					meta: true,
				}),
			),
	)
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
