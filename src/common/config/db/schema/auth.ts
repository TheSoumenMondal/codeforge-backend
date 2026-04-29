import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./user.js";

export const oauth_accounts = pgTable("oauth_accounts", {
	id: uuid("id").primaryKey().defaultRandom(),
	user_id: uuid("user_id").notNull(),
	provider: varchar("provider").notNull(),
	provider_account_id: varchar("provider_account_id").notNull(),
	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const password_account = pgTable("password_accounts", {
	id: uuid("id").primaryKey().defaultRandom(),
	user_id: uuid("user_id").notNull(),
	password_hash: varchar("password_hash").notNull(),
	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
});

export const oauth_account_relations = relations(oauth_accounts, ({ one }) => ({
	user: one(user, {
		fields: [oauth_accounts.user_id],
		references: [user.id],
	}),
}));

export const password_account_relations = relations(
	password_account,
	({ one }) => ({
		user: one(user, {
			fields: [password_account.user_id],
			references: [user.id],
		}),
	}),
);
