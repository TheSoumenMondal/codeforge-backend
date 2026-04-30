import z from "zod";

const SubmissionDTO = z.object({
	problemId: z.string(),
	userId: z.string(),
	code: z.string(),
	status: z.enum(["pending", "accepted", "rejected"]),
	result: z.string().optional(),
});

export type SubmissionDTOType = z.infer<typeof SubmissionDTO>;

export { SubmissionDTO };
