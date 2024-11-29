"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import {
  accounts,
  NewTransactionWithProperAmount,
  transactions,
} from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";

export type EditTransactionFunctionResponse =
  Readonly<NewTransactionWithProperAmount>;
export type EditTransactionFunctionRequest = {
  id?: number;
} & typeof transactions.$inferInsert;

export async function editTransactionFunction({
  id,
  date,
  amount,
  payee,
  accountId,
  note,
  categoryId,
}: EditTransactionFunctionRequest): Promise<EditTransactionFunctionResponse> {
  try {
    if (!id) {
      throw new Error("Id is required");
    }

    if (!date || !amount || !payee || !accountId) {
      throw new Error("Date, amount, payee and account are required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const transactionsToUpdate = db.$with("transactions_to_delete").as(
      db
        .select({
          id: transactions.id,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(accounts.userId, userId), eq(transactions.id, id))),
    );

    const [data] = await db
      .with(transactionsToUpdate)
      .update(transactions)
      .set({
        date,
        amount,
        payee,
        accountId,
        note: note || null,
        categoryId: categoryId || null,
        updatedAt: new Date(),
      })
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`),
      )
      .returning();

    if (!data) {
      console.error("Transaction not found");
      throw new Error("Transaction not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to edit transaction", e);
    throw new Error("Failed to edit transaction");
  }
}
