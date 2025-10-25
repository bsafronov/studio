import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { createUpdateSchema } from "drizzle-zod";
import z from "zod";
import { sheetColumnsTable } from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const updateColumn = authProcedure
	.input(
		z
			.object({
				columnId: z.string(),
			})
			.and(
				createUpdateSchema(sheetColumnsTable).pick({
					name: true,
					meta: true,
					required: true,
				}),
			),
	)
	.handler(async ({ context, input }) => {
		const { columnId, meta, name, required } = input;
		const column = await context.db.query.sheetColumnsTable.findFirst({
			where: eq(sheetColumnsTable.id, columnId),
		});

		if (!column) {
			throw new ORPCError("NOT_FOUND");
		}

		if (column.createdById !== context.user.id) {
			throw new ORPCError("UNAUTHORIZED");
		}

		const [updatedColumn] = await context.db
			.update(sheetColumnsTable)
			.set({
				name,
				meta,
				required,
				updatedAt: new Date(),
				updatedById: context.user.id,
			})
			.where(eq(sheetColumnsTable.id, columnId))
			.returning();
		return updatedColumn;
	});
