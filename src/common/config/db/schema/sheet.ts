import {
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

import { user } from "./user.js";

export const sheet = pgTable("sheet", {
	id: uuid("id").primaryKey().defaultRandom(),

	title: varchar("title", { length: 255 }).notNull(),

	description: text("description"),

	visibility: varchar("visibility", { length: 20 })
		.notNull()
		.default("private"),

	categories: text("categories").array(),

	created_by: uuid("created_by")
		.notNull()
		.references(() => user.id, {
			onDelete: "cascade",
		}),

	created_at: timestamp("created_at").defaultNow(),

	updated_at: timestamp("updated_at")
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const sheetQuestion = pgTable(
	"sheet_question",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		sheet_id: uuid("sheet_id")
			.notNull()
			.references(() => sheet.id, {
				onDelete: "cascade",
			}),

		created_at: timestamp("created_at").defaultNow(),

		updated_at: timestamp("updated_at")
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => {
		return {
			unique_sheet_question: uniqueIndex("unique_sheet_question").on(
				table.sheet_id,
			),
		};
	},
);
