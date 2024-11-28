"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export type CreateTransactionsFunctionResponse = Readonly<
  typeof transactions.$inferInsert
>;
export type CreateTransactionsFunctionRequest = Readonly<
  typeof transactions.$inferInsert
>;

export async function createTransactionsFunction({
  date,
  amount,
  payee,
  accountId,
  note,
  categoryId,
}: CreateTransactionsFunctionRequest): Promise<CreateTransactionsFunctionResponse> {
  try {
    if (!date || !amount || !payee || !accountId) {
      throw new Error("Date, amount, payee and account are required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const newTransaction = {
      date,
      amount,
      payee,
      accountId,
      note: note || null,
      categoryId: categoryId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    };

    const [data] = await db
      .insert(transactions)
      .values(newTransaction)
      .returning();

    if (!data) {
      console.error("Transaction not found");
      throw new Error("Transaction not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to create transaction", e);
    throw new Error("Failed to create transaction");
  }
}
