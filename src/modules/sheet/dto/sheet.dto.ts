import z from "zod";

export const SheetDto = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	visibility: z.enum(["public", "private"]).default("private"),
	categories: z.array(z.string()).optional(),
});

export type SheetDtoType = z.infer<typeof SheetDto>;

export const UpdateSheetDto = z.object({
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	visibility: z.enum(["public", "private"]).optional(),
	categories: z.array(z.string()).optional(),
});

export type UpdateSheetDtoType = z.infer<typeof UpdateSheetDto>;
