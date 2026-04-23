import z from "zod";

export const ProblemDto = z.object({
	title: z.string().min(3).max(255),
});

export type ProblemDto = z.infer<typeof ProblemDto>;
