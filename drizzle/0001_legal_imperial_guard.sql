DROP INDEX "unique_sheet_question";--> statement-breakpoint
ALTER TABLE "sheet_question" ADD COLUMN "problem_id" uuid;--> statement-breakpoint
ALTER TABLE "sheet_question" ADD CONSTRAINT "sheet_question_problem_id_problem_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_sheet_question" ON "sheet_question" USING btree ("sheet_id","problem_id");