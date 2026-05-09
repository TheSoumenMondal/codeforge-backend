import z from "zod";

const CreateTestCaseDto = z.object({
	input: z.string(),
	output: z.string(),
	totalExecutionTime: z.number(),
});

const UpdateTestCaseDto = z.object({
	testCaseId: z.string().optional(),
	input: z.string().optional(),
	output: z.string().optional(),
	totalExecutionTime: z.number().optional(),
});

export type CreateTestCaseDtoType = z.infer<typeof CreateTestCaseDto>;
export type UpdateTestCaseDtoType = z.infer<typeof UpdateTestCaseDto>;

export { CreateTestCaseDto, UpdateTestCaseDto };
