import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { sheetsTable } from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const updateSheet = authProcedure
	.input(
		z
			.object({
				sheetId: z.string(),
			})
			.and(createUpdateSchema(sheetsTable).pick({ name: true })),
	)
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
