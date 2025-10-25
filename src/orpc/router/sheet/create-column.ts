import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { sheetColumnsTable, sheetsTable } from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const createColumn = authProcedure
	.input(
		createInsertSchema(sheetColumnsTable).pick({
			name: true,
			required: true,
			sheetId: true,
			type: true,
			meta: true,
		}),
	)
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
