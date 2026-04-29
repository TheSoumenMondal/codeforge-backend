import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { problem } from "./problem.js";

export const user = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	bio: text("bio"),
	email: text("email").notNull().unique(),
	email_verified: boolean("email_verified").notNull().default(false),
	location: text("location"),
	avatar_url: text("avatar_url"),
	website_url: text("website_url"),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp()
		.notNull()
		.$onUpdateFn(() => new Date()),
});

export const userRelations = relations(user, ({ many }) => ({
	problem: many(problem),
}));
