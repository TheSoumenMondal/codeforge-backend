import z from "zod";

const CreateTestCaseDto = z.object({
	input: z.json(),
	output: z.json(),
	totalExecutionTime: z.number(),
});

export type CreateTestCaseDtoType = z.infer<typeof CreateTestCaseDto>;

export { CreateTestCaseDto };
