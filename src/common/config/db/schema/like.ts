import { relations } from "drizzle-orm";
import { pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { problem } from "./problem.js";
import { user } from "./user.js";

export const problemLikes = pgTable(
	"problem_likes",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),

		problemId: uuid("problem_id")
			.notNull()
			.references(() => problem.id, { onDelete: "cascade" }),

		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.userId, table.problemId],
		}),
	}),
);

export const problemLikesRelations = relations(problemLikes, ({ one }) => ({
	user: one(user, {
		fields: [problemLikes.userId],
		references: [user.id],
	}),
	problem: one(problem, {
		fields: [problemLikes.problemId],
		references: [problem.id],
	}),
}));
