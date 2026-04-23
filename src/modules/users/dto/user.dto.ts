import z from "zod";

export const createUserDto = z.object({
	name: z.string().min(3).max(100),
	email: z.email(),
});

export type CreateUserDto = z.infer<typeof createUserDto>;
