import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user.js";

export const article = pgTable("article", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	slug: text("slug").unique().notNull(),
	content: text("content").notNull(),
	excerpt: text("excerpt"),

	cover_image: text("cover_image"),

	author_id: uuid("author_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	status: text("status").default("draft").notNull(),

	views: integer("views").default(0),

	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
	published_at: timestamp("published_at"),
});

export const articleRelations = relations(article, ({ one }) => ({
	author: one(user, {
		fields: [article.author_id],
		references: [user.id],
	}),
}));
