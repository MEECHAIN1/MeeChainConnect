import { users, profiles, type User, type InsertUser, type Profile, type InsertProfile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProfile(walletAddress: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(walletAddress: string, profile: Partial<InsertProfile>): Promise<Profile>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProfile(walletAddress: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.walletAddress, walletAddress));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateProfile(walletAddress: string, update: Partial<InsertProfile>): Promise<Profile> {
    const existing = await this.getProfile(walletAddress);
    if (!existing) {
      if (!update.walletAddress) {
        throw new Error("Cannot create profile without wallet address");
      }
      return this.createProfile({ ...update, walletAddress: update.walletAddress as string });
    }
    
    const [profile] = await db.update(profiles)
      .set(update)
      .where(eq(profiles.walletAddress, walletAddress))
      .returning();
    return profile;
  }
}

export const storage = new DatabaseStorage();
