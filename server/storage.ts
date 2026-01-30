
import { db } from "./db";
import {
  users, medicines, healthRecords, messages,
  type User, type InsertUser,
  type Medicine, type InsertMedicine,
  type HealthRecord, type InsertHealthRecord,
  type Message, type InsertMessage
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Medicines
  getMedicines(userId: number): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  toggleMedicineTaken(id: number, taken: boolean): Promise<Medicine>;

  // Health Records
  getHealthRecords(userId: number): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;

  // Messages
  getMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getMedicines(userId: number): Promise<Medicine[]> {
    return await db.select().from(medicines).where(eq(medicines.userId, userId));
  }

  async createMedicine(medicine: InsertMedicine): Promise<Medicine> {
    const [newMedicine] = await db.insert(medicines).values(medicine).returning();
    return newMedicine;
  }

  async toggleMedicineTaken(id: number, taken: boolean): Promise<Medicine> {
    const [updated] = await db.update(medicines)
      .set({ taken })
      .where(eq(medicines.id, id))
      .returning();
    return updated;
  }

  async getHealthRecords(userId: number): Promise<HealthRecord[]> {
    return await db.select()
      .from(healthRecords)
      .where(eq(healthRecords.userId, userId))
      .orderBy(desc(healthRecords.date));
  }

  async createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord> {
    const [newRecord] = await db.insert(healthRecords).values(record).returning();
    return newRecord;
  }

  async getMessages(userId: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.userId, userId))
      .orderBy(messages.timestamp);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
