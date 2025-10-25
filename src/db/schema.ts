import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
	boolean,
	jsonb,
	pgEnum,
	pgTableCreator,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const pgTable = pgTableCreator((name) => `studio_${name}`);

export const id = uuid("id").primaryKey().default(sql`gen_random_uuid()`);

export const createdAt = timestamp("created_at", { mode: "date" })
	.notNull()
	.defaultNow();
export const updatedAt = timestamp("updated_at", { mode: "date" });
export const createdById = uuid("created_by_id")
	.notNull()
	.references(() => usersTable.id);
export const updatedById = uuid("updated_by_id").references(
	() => usersTable.id,
);

const base = {
	id,
	createdAt,
	updatedAt,
	createdById,
	updatedById,
};

export const usersTable = pgTable("users", {
	id,
	username: varchar("username").notNull().unique(),
	password: varchar("hash_password").notNull(),
	createdAt,
	updatedAt,
});

export const usersRelations = relations(usersTable, ({ many }) => ({
	sessions: many(sessionsTable),
}));

export const sessionsTable = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date",
	}).notNull(),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [sessionsTable.userId],
		references: [usersTable.id],
	}),
}));

export const workspacesTable = pgTable("workspaces", {
	...base,
	name: varchar("name").notNull(),
});

export const workspacesRelations = relations(workspacesTable, ({ one }) => ({
	createdBy: one(usersTable, {
		fields: [workspacesTable.createdById],
		references: [usersTable.id],
		relationName: "workspace_created_by",
	}),
	updatedBy: one(usersTable, {
		fields: [workspacesTable.updatedById],
		references: [usersTable.id],
		relationName: "workspace_updated_by",
	}),
}));

export const sheetsTable = pgTable("sheets", {
	...base,
	workspaceId: uuid("workspace_id").references(() => workspacesTable.id, {
		onDelete: "cascade",
	}),
	name: varchar("name").notNull(),
});

export const sheetsRelations = relations(sheetsTable, ({ one, many }) => ({
	createdBy: one(usersTable, {
		fields: [sheetsTable.createdById],
		references: [usersTable.id],
		relationName: "sheet_created_by",
	}),
	updatedBy: one(usersTable, {
		fields: [sheetsTable.updatedById],
		references: [usersTable.id],
		relationName: "sheet_updated_by",
	}),
	workspace: one(workspacesTable, {
		fields: [sheetsTable.workspaceId],
		references: [workspacesTable.id],
	}),
	columns: many(sheetColumnsTable),
	rows: many(sheetRowsTable),
}));

export const sheetColumnType = pgEnum("sheet_column_type", [
	"string",
	"number",
	"boolean",
	"date",
]);

export const sheetColumnsTable = pgTable("sheet_columns", {
	...base,
	sheetId: uuid("sheet_id")
		.notNull()
		.references(() => sheetsTable.id, { onDelete: "cascade" }),
	name: varchar("name").notNull(),
	type: sheetColumnType("type").notNull().default("string"),
	required: boolean("required").notNull().default(true),
	meta: jsonb("meta").$type<Record<string, unknown>>(),
});

export const sheetColumnsRelations = relations(
	sheetColumnsTable,
	({ one }) => ({
		createdBy: one(usersTable, {
			fields: [sheetColumnsTable.createdById],
			references: [usersTable.id],
			relationName: "sheet_column_created_by",
		}),
		updatedBy: one(usersTable, {
			fields: [sheetColumnsTable.updatedById],
			references: [usersTable.id],
			relationName: "sheet_column_updated_by",
		}),
		sheet: one(sheetsTable, {
			fields: [sheetColumnsTable.sheetId],
			references: [sheetsTable.id],
		}),
	}),
);

export const sheetRowsTable = pgTable("sheet_rows", {
	...base,
	sheetId: uuid("sheet_id")
		.notNull()
		.references(() => sheetsTable.id, { onDelete: "cascade" }),
	data: jsonb("data").$type<Record<string, unknown>>().notNull(),
	meta: jsonb("meta").$type<Record<string, unknown>>(),
});

export const sheetRowsRelations = relations(sheetRowsTable, ({ one }) => ({
	createdBy: one(usersTable, {
		fields: [sheetRowsTable.createdById],
		references: [usersTable.id],
		relationName: "sheet_row_created_by",
	}),
	updatedBy: one(usersTable, {
		fields: [sheetRowsTable.updatedById],
		references: [usersTable.id],
		relationName: "sheet_row_updated_by",
	}),
	sheet: one(sheetsTable, {
		fields: [sheetRowsTable.sheetId],
		references: [sheetsTable.id],
	}),
}));

export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
export type Workspace = InferSelectModel<typeof workspacesTable>;
export type Sheet = InferSelectModel<typeof sheetsTable>;
export type SheetColumn = InferSelectModel<typeof sheetColumnsTable>;
export type SheetRow = InferSelectModel<typeof sheetRowsTable>;
