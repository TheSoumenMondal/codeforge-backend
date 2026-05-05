import z from "zod";

const CreatePostDto = z
	.object({
		title: z.string().min(1).max(255),
		content: z.string().min(1),
		images: z.array(z.url()).max(3).default([]),
		tags: z.array(z.string()).max(5).default([]),
	})
	.strict();

export type CreatePostDto = z.infer<typeof CreatePostDto>;
export { CreatePostDto };
