import { eq } from "drizzle-orm";
import z from "zod";
import { sheetColumnsTable } from "@/db/schema";
import { baseProcedure } from "@/orpc/utils";

export const columnList = baseProcedure
	.input(z.object({ sheetId: z.string() }))
	.handler(async ({ context, input }) => {
		const columns = await context.db.query.sheetColumnsTable.findMany({
			where: eq(sheetColumnsTable.sheetId, input.sheetId),
		});
		return columns;
	});
