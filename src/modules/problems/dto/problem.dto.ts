import z from "zod";

export const ProblemDto = z.object({
	title: z.string().min(3).max(255),
	description: z.string().min(10).max(5000),
	difficulty: z.enum(["easy", "medium", "hard"]),
});

export const TestCaseDto = z.object({
	problem_id: z.string(),
	input: z.string().min(1).max(1000),
	output: z.string().min(1).max(1000),
	total_execution_time: z.number().min(0),
});

export const CodeStubDto = z.object({
	problem_id: z.string(),
	language: z.string(),
	start_code: z.string().min(1).max(10000),
	user_code: z.string().min(1).max(10000).optional(),
	end_code: z.string().min(1).max(10000),
});

export type ProblemDto = z.infer<typeof ProblemDto>;
export type TestCaseDto = z.infer<typeof TestCaseDto>;
export type CodeStubDto = z.infer<typeof CodeStubDto>;
