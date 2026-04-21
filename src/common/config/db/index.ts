import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { envConfig } from "../server.config.js";

const db = drizzle(envConfig.DATABASE_URL);

export { db };
