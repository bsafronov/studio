import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import z from "zod";
import { sheetRowsTable } from "@/db/schema";
import { baseProcedure } from "@/orpc/utils";
import { withSafeUser } from "../auth";

export const row = baseProcedure
	.input(z.object({ rowId: z.string() }))
	.handler(async ({ context, input }) => {
		const row = await context.db.query.sheetRowsTable.findFirst({
			where: eq(sheetRowsTable.id, input.rowId),
			with: {
				updatedBy: withSafeUser,
				createdBy: withSafeUser,
			},
		});

		if (!row) {
			throw new ORPCError("NOT_FOUND");
		}

		return row;
	});
