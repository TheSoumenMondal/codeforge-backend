import z from "zod";

export const CreateCodeStubDto = z.object({
	problemId: z.string(),
	language: z.enum(["python", "javascript", "java", "cpp"]),
	startCode: z.string(),
	userCode: z.string(),
	endCode: z.string(),
});

export const UpdateCodeStubDto = z.object({
	startCode: z.string().optional(),
	userCode: z.string().optional(),
	endCode: z.string().optional(),
});

export type UpdateCodeStubDtoType = z.infer<typeof UpdateCodeStubDto>;
export type CreateCodeStubDtoType = z.infer<typeof CreateCodeStubDto>;
