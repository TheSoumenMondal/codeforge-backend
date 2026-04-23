CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('cpp', 'java', 'python', 'js');--> statement-breakpoint
CREATE TABLE "code_stub" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"language" "language" NOT NULL,
	"start_code" text NOT NULL,
	"user_code" text,
	"end_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "difficulty_check" CHECK ("problem"."difficulty" in ('easy', 'medium', 'hard'))
);
--> statement-breakpoint
CREATE TABLE "test_case" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"input" json NOT NULL,
	"output" json NOT NULL,
	"total_execution_time" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"location" text,
	"avatar_url" text,
	"website_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "code_stub" ADD CONSTRAINT "code_stub_problem_id_problem_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_case" ADD CONSTRAINT "test_case_problem_id_problem_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem"("id") ON DELETE no action ON UPDATE no action;