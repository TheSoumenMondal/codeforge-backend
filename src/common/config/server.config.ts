import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.string().default("3000"),
	API_VERSION_PREFIX: z.string().regex(/^\/api\/v[1-9]\d*$/),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string(),
	JWT_EXPIRES_IN: z.string().default("1h"),
	LOGGER_LEVEL: z
		.enum(["trace", "debug", "info", "warn", "error", "fatal"])
		.default("info"),
	IMAGEKIT_PRIVATE_KEY: z.string(),
	REDIS_HOST: z.string(),
	REDIS_PORT: z.string(),
	CORS_ORIGIN: z.string(),
});

type EnvConfig = z.infer<typeof envSchema>;

const getEnvConfig = (): EnvConfig => {
	const parsedEnv = envSchema.safeParse(process.env);
	if (!parsedEnv.success) {
		parsedEnv.error.issues.forEach((issue) => {
			console.error({
				issue: issue.code,
				message: issue.message,
				path: issue.path.join("."),
			});
		});
		process.exit(1);
	}
	return parsedEnv.data;
};

const envConfig = getEnvConfig();

export { envConfig };
