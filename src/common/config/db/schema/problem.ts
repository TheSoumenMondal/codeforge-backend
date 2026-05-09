import { relations, sql } from "drizzle-orm";
import {
	check,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user.js";

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);

export const languageEnum = pgEnum("language", ["cpp", "java", "python", "js"]);

export const problem = pgTable(
	"problem",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		description: text("description").notNull(),
		difficulty: difficultyEnum("difficulty").notNull(),
		created_by: uuid("created_by").notNull(),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at")
			.notNull()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		check(
			"difficulty_check",
			sql`${table.difficulty} in ('easy', 'medium', 'hard')`,
		),
	],
);

export const test_case = pgTable("test_case", {
	id: uuid("id").primaryKey().defaultRandom(),
	problem_id: uuid("problem_id")
		.references(() => problem.id, {
			onDelete: "cascade",
		})
		.notNull(),
	input: text("input_test_case").notNull(),
	expected_output: text("expected_output_test_case").notNull(),
	total_execution_time: integer("total_execution_time").notNull(),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at")
		.notNull()
		.$onUpdateFn(() => new Date()),
});

export const code_stub = pgTable(
	"code_stub",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		problem_id: uuid("problem_id")
			.references(() => problem.id, {
				onDelete: "cascade",
			})
			.notNull(),
		language: languageEnum("language").notNull(),
		start_code: text("start_code").notNull(),
		user_code: text("user_code"),
		end_code: text("end_code").notNull(),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at")
			.notNull()
			.$onUpdateFn(() => new Date()),
	},
	(table) => [
		uniqueIndex("unique_problem_language").on(table.problem_id, table.language),
	],
);

export const problemRelations = relations(problem, ({ many, one }) => ({
	testCases: many(test_case),
	codeStubs: many(code_stub),
	creator: one(user, {
		fields: [problem.created_by],
		references: [user.id],
	}),
}));

export const testCaseRelations = relations(test_case, ({ one }) => ({
	problem: one(problem, {
		fields: [test_case.problem_id],
		references: [problem.id],
	}),
}));

export const codeStubRelations = relations(code_stub, ({ one }) => ({
	problem: one(problem, {
		fields: [code_stub.problem_id],
		references: [problem.id],
	}),
}));
