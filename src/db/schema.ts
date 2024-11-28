import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// BASE FIELDS
const timestampFields = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};

// DB SCHEMA ---- ACCOUNTS
export const accounts = pgTable("budget_accounts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(), // CLERK_USER_ID
  ...timestampFields,
});
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));
// VALIDATION SCHEMA
export const insertAccountsSchema = createInsertSchema(accounts);
// TYPES
export type NewAccount = z.infer<typeof insertAccountsSchema>;
export type SelectAccount = typeof accounts.$inferSelect;

// DB SCHEMA ---- CATEGORIES
export const categories = pgTable("budget_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("user_id").notNull(), // CLERK_USER_ID
  ...timestampFields,
});
export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));
// VALIDATION SCHEMA
export const insertCategoriesSchema = createInsertSchema(categories);
// TYPES
export type NewCategory = z.infer<typeof insertCategoriesSchema>;
export type SelectCategory = typeof categories.$inferSelect;

// DB SCHEMA ---- TRANSACTIONS
export const transactions = pgTable("budget_transactions", {
  id: serial("id").primaryKey(),
  amount: numeric("amount", {
    precision: 10, // total digits
    scale: 2, // decimal places
  }).notNull(),
  payee: text("payee").notNull(),
  note: text("note"),
  date: timestamp("date").notNull(),
  userId: text("user_id").notNull(), // CLERK_USER_ID
  accountId: integer("account_id")
    .references(() => accounts.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  ...timestampFields,
});
export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));
// VALIDATION SCHEMA
export const insertTransactionsSchema = createInsertSchema(transactions, {
  amount: z
    .number()
    .min(0.01) // minimum amount
    .multipleOf(0.01) // ensures max 2 decimal places
    .refine(
      (n) => n <= 999999.99, // maximum amount
      { message: "MIN 0.01 - MAX 999999.99" },
    ),
  date: z.coerce.date(),
});
// TYPES
export type NewTransaction = z.infer<typeof insertTransactionsSchema>;
export type NewTransactionWithProperAmount = Omit<NewTransaction, "amount"> & {
  amount: string;
};
export type SelectTransaction = typeof transactions.$inferSelect;
export type FullSelectTransaction = SelectTransaction & {
  account: SelectAccount;
  category: SelectCategory;
};
