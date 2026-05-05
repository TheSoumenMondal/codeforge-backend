import z from "zod";

const CreatePostDto = z
	.object({
		title: z.string().min(1).max(255),
		content: z.string().min(1),
		images: z.array(z.url()).max(3).default([]),
		tags: z.array(z.string()).max(5).default([]),
	})
	.strict();

const UpdatePostDto = z.object({
	title: z.string().min(1).max(255).optional(),
	content: z.string().min(1).optional(),
	images: z.array(z.url()).max(3).optional(),
	tags: z.array(z.string()).max(5).optional(),
});

export type CreatePostDto = z.infer<typeof CreatePostDto>;
export type UpdatePostDto = z.infer<typeof UpdatePostDto>;
export { CreatePostDto, UpdatePostDto };
