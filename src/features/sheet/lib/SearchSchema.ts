import z from "zod";

export const SheetSearchSchema = z.object({
	page: z.number().optional().default(1),
	limit: z.number().optional().default(20),
	sorting: z
		.array(
			z.object({
				id: z.string(),
				desc: z.boolean(),
			}),
		)
		.default([]),
	columnFilters: z
		.array(
			z.object({
				id: z.string(),
				value: z.unknown(),
			}),
		)
		.default([]),
});
