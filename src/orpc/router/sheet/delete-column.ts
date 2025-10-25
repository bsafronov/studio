import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import z from "zod";
import { sheetColumnsTable } from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const deleteColumn = authProcedure
	.input(z.object({ columnId: z.string() }))
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
