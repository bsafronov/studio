import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { sheetRowsTable, sheetsTable } from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const createRow = authProcedure
	.input(
		createInsertSchema(sheetRowsTable).pick({
			data: true,
			sheetId: true,
			meta: true,
		}),
	)
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
