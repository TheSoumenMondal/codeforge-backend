import z from "zod";

const CreateTestCaseDto = z.object({
	input: z.json(),
	output: z.json(),
	totalExecutionTime: z.number(),
});

const UpdateTestCaseDto = z.object({
	input: z.json().optional(),
	output: z.json().optional(),
	totalExecutionTime: z.number().optional(),
});

export type CreateTestCaseDtoType = z.infer<typeof CreateTestCaseDto>;
export type UpdateTestCaseDtoType = z.infer<typeof UpdateTestCaseDto>;

export { CreateTestCaseDto, UpdateTestCaseDto };
