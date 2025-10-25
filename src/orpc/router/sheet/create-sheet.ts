import { createInsertSchema } from "drizzle-zod";
import { sheetsTable } from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const createSheet = authProcedure
	.input(
		createInsertSchema(sheetsTable).pick({
			name: true,
		}),
	)
	.handler(async ({ context, input }) => {
		const [sheet] = await context.db
			.insert(sheetsTable)
			.values({
				name: input.name,
				createdById: context.user.id,
			})
			.returning();

		return sheet;
	});
