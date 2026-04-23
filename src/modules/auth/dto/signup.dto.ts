import z from "zod";
import { createUserDto } from "../../users/dto/user.dto.js";

export const signupDto = createUserDto.extend({
	password: z.string().min(4).max(128),
});

export const passwordAccountDto = z.object({
	userId: z.string(),
	passwordHash: z.string(),
});

export type SignupDto = z.infer<typeof signupDto>;
export type PasswordAccountDto = z.infer<typeof passwordAccountDto>;
