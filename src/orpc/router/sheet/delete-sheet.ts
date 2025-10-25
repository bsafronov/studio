import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import z from "zod";
import { sheetsTable } from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const deleteSheet = authProcedure
	.input(z.object({ sheetId: z.string() }))
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
