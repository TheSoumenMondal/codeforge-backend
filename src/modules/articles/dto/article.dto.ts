import z from "zod";

const ArticleDto = z.object({
	title: z.string(),
	content: z.string(),
	excerpt: z.string().optional(),
	cover_image: z.string().optional(),
});

export { ArticleDto };
export type ArticleDto = z.infer<typeof ArticleDto>;
