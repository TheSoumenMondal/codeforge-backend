import { relations, sql } from "drizzle-orm";
import { check, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user.js";

const post = pgTable(
	"post",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		content: text("content").notNull(),
		authorId: uuid("author_id")
			.notNull()
			.references(() => user.id, {
				onDelete: "cascade",
			}),
		images: text("images").array().default([]),
		tags: text("tags").array().notNull().default([]),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdateFn(() => new Date()),
	},
	(table) => ({
		imagesLimit: check(
			"images_max_3",
			sql`array_length(${table.images}, 1) <= 3`,
		),
		tagsLimit: check("tags_max_5", sql`array_length(${table.tags}, 1) <= 5`),
	}),
);

export { post };

export const postUserRelation = relations(post, ({ one }) => ({
	user: one(user, {
		fields: [post.authorId],
		references: [user.id],
	}),
}));
