import bcrypt from "bcryptjs";

const passwordUtils = {
	hashPassword: async (pass: string): Promise<string> => {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(pass, salt);
	},

	comparePassword: async (
		pass: string,
		hashPassword: string,
	): Promise<boolean> => {
		return await bcrypt.compare(pass, hashPassword);
	},
};

export { passwordUtils };
