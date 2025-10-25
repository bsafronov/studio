import { faker } from "@faker-js/faker";
import z from "zod";
import {
	type SheetColumn,
	sheetColumnsTable,
	sheetColumnType,
	sheetRowsTable,
	sheetsTable,
} from "@/db/schema";
import { authProcedure } from "@/orpc/utils";

export const createMockSheet = authProcedure
	.input(
		z.object({
			columnsCount: z.number().max(100).default(10),
			rowsCount: z.number().max(1000).default(100),
		}),
	)
	.handler(async ({ context: { db, user }, input }) => {
		const { columnsCount, rowsCount } = input;

		const [sheet] = await db
			.insert(sheetsTable)
			.values({
				name: faker.word.noun(),
				createdById: user.id,
			})
			.returning();

		const columnValues = Array.from({ length: columnsCount }, (_) => {
			return {
				createdById: user.id,
				name: faker.word.noun(),
				sheetId: sheet.id,
				type: faker.helpers.arrayElement(sheetColumnType.enumValues),
				required: faker.datatype.boolean(),
			} satisfies typeof sheetColumnsTable.$inferInsert;
		});

		const columns = await db
			.insert(sheetColumnsTable)
			.values(columnValues)
			.returning();

		const rowValues = Array.from({ length: rowsCount }, (_) => {
			return {
				createdById: user.id,
				data: getRowData(columns.slice(0, columnsCount)),
				sheetId: sheet.id,
			} satisfies typeof sheetRowsTable.$inferInsert;
		});

		await db.insert(sheetRowsTable).values(rowValues);
		return sheet;
	});

const fakerFnByColumnType: Record<SheetColumn["type"], () => unknown> = {
	string: faker.word.noun,
	boolean: faker.datatype.boolean,
	number: faker.number.int,
	date: faker.date.anytime,
};

const getRowData = (columns: SheetColumn[]) => {
	const data: Record<string, unknown> = {};
	for (const { type, id } of columns) {
		data[id] = fakerFnByColumnType[type]();
	}
	return data;
};
