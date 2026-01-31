import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  bannerUrl: text("banner_url"),
  energy: integer("energy").default(100),
  tokens: text("tokens").default("0"),
  level: integer("level").default(1),
});

export const wallets = pgTable("wallets", {
  id: text("id").primaryKey(),
  address: text("address").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  ownerAddress: text("owner_address").notNull(),
  isDeployed: boolean("is_deployed").default(false),
  balanceNative: text("balance_native").default("0"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertProfileSchema = createInsertSchema(profiles);
export const insertWalletSchema = createInsertSchema(wallets);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
