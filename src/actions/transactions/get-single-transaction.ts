"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type SingleTransactionFunctionResponse = Readonly<{
  id: number;
  categoryId: number | null;
  note: string | null;
  amount: string;
  accountId: number;
  date: Date;
  payee: string;
}>;
export type SingleTransactionFunctionRequest = Readonly<{
  id?: number;
}>;

export async function getSingleTransactionFunction({
  id,
}: SingleTransactionFunctionRequest): Promise<SingleTransactionFunctionResponse> {
  try {
    if (!id) {
      throw new Error("Id is required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [data] = await db
      .select({
        id: transactions.id,
        categoryId: transactions.categoryId,
        note: transactions.note,
        amount: transactions.amount,
        accountId: transactions.accountId,
        date: transactions.date,
        payee: transactions.payee,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(eq(transactions.id, id), eq(accounts.userId, userId)));

    if (!data) {
      console.error("Category not found");
      throw new Error("Category not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to get single category", e);
    throw new Error("Failed to get single category");
  }
}
