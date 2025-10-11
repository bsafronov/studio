CREATE TYPE "public"."sheet_column_type" AS ENUM('string', 'number', 'boolean', 'date');--> statement-breakpoint
CREATE TABLE "studio_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_sheet_columns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_by_id" uuid NOT NULL,
	"updated_by_id" uuid,
	"sheet_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"type" "sheet_column_type" DEFAULT 'string' NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"meta" jsonb
);
--> statement-breakpoint
CREATE TABLE "studio_sheet_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_by_id" uuid NOT NULL,
	"updated_by_id" uuid,
	"sheet_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"meta" jsonb
);
--> statement-breakpoint
CREATE TABLE "studio_sheets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_by_id" uuid NOT NULL,
	"updated_by_id" uuid,
	"workspace_id" uuid,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "studio_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"hash_password" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "studio_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "studio_workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_by_id" uuid NOT NULL,
	"updated_by_id" uuid,
	"name" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "studio_sessions" ADD CONSTRAINT "studio_sessions_user_id_studio_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."studio_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sheet_columns" ADD CONSTRAINT "studio_sheet_columns_created_by_id_studio_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."studio_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sheet_columns" ADD CONSTRAINT "studio_sheet_columns_updated_by_id_studio_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."studio_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sheet_columns" ADD CONSTRAINT "studio_sheet_columns_sheet_id_studio_sheets_id_fk" FOREIGN KEY ("sheet_id") REFERENCES "public"."studio_sheets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sheet_rows" ADD CONSTRAINT "studio_sheet_rows_created_by_id_studio_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."studio_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sheet_rows" ADD CONSTRAINT "studio_sheet_rows_updated_by_id_studio_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."studio_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sheet_rows" ADD CONSTRAINT "studio_sheet_rows_sheet_id_studio_sheets_id_fk" FOREIGN KEY ("sheet_id") REFERENCES "public"."studio_sheets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sheets" ADD CONSTRAINT "studio_sheets_created_by_id_studio_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."studio_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sheets" ADD CONSTRAINT "studio_sheets_updated_by_id_studio_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."studio_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_sheets" ADD CONSTRAINT "studio_sheets_workspace_id_studio_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."studio_workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_workspaces" ADD CONSTRAINT "studio_workspaces_created_by_id_studio_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."studio_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studio_workspaces" ADD CONSTRAINT "studio_workspaces_updated_by_id_studio_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."studio_users"("id") ON DELETE no action ON UPDATE no action;