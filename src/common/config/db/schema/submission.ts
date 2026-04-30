import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { SUBMISSION_STATUS } from "../../../constants/submission-status.js";
import { problem } from "./problem.js";
import { user } from "./user.js";

const code_submission = pgTable("code_submission", {
	id: uuid("id").primaryKey().defaultRandom(),
	problem_id: uuid("problem_id")
		.notNull()
		.references(() => problem.id, { onDelete: "cascade" }),
	user_id: uuid("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	code: text("code").notNull(),
	language: text("language").notNull(),
	status: text("status").default(SUBMISSION_STATUS.PENDING),
	result: text("result").notNull().default(""),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const codeSubmissionRelations = relations(
	code_submission,
	({ one }) => ({
		problem: one(problem, {
			fields: [code_submission.problem_id],
			references: [problem.id],
		}),
		user: one(user, {
			fields: [code_submission.user_id],
			references: [user.id],
		}),
	}),
);

export { code_submission };
