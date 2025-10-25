import { eq } from "drizzle-orm";
import z from "zod";
import { sheetRowsTable } from "@/db/schema";
import { baseProcedure } from "@/orpc/utils";
import { withSafeUser } from "../auth";

export const rowList = baseProcedure
	.input(
		z.object({
			sheetId: z.string(),
			page: z.number().default(1),
			limit: z.number().default(20),
		}),
	)
	.handler(async ({ context, input }) => {
		const { limit, page } = input;
		const rows = await context.db.query.sheetRowsTable.findMany({
			where: eq(sheetRowsTable.sheetId, input.sheetId),
			with: {
				updatedBy: withSafeUser,
				createdBy: withSafeUser,
			},
			limit,
			offset: (page - 1) * limit,
		});
		return rows;
	});
