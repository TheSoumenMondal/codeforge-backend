import z from "zod";

export const createUserDto = z.object({
	name: z.string().min(3).max(100),
	email: z.email(),
});

export const updateUserDto = z
	.object({
		name: z.string().optional(),
		bio: z.string().optional(),
		location: z.string().optional(),
		website_url: z.string().optional(),
		avatar_url: z.string().optional(),
	})
	.strict();

export type CreateUserDto = z.infer<typeof createUserDto>;
export type UpdateUserDto = z.infer<typeof updateUserDto>;
