import { baseProcedure } from "@/orpc/utils";
import { withSafeUser } from "../auth";

export const sheetList = baseProcedure.handler(async ({ context }) => {
	return context.db.query.sheetsTable.findMany({
		with: {
			workspace: {
				columns: {
					id: true,
					name: true,
				},
			},
			createdBy: withSafeUser,
			updatedBy: withSafeUser,
		},
	});
});
