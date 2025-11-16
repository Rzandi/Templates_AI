import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product types (for in-memory storage)
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

export const insertProductSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  image: z.string().url(),
  description: z.string().optional(),
  category: z.string().optional()
});

export type InsertProduct = z.infer<typeof insertProductSchema>;

// Order types
export interface Order {
  id: string;
  customer: {
    email: string;
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: Date;
}

export const insertOrderSchema = z.object({
  customer: z.object({
    email: z.string().email(),
    fullName: z.string(),
    address: z.string(),
    city: z.string(),
    zipCode: z.string(),
    country: z.string()
  }),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().positive(),
    image: z.string()
  })),
  total: z.number().positive()
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Invoice types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customer: {
    email: string;
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  date: Date;
  shipping?: number;
}

export type InsertInvoice = Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>;
