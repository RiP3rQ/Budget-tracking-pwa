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

export type DeleteTransactionFunctionResponse = Readonly<
  NewTransactionWithProperAmount[]
>;
export type DeleteTransactionFunctionRequest = Readonly<{
  id?: number;
}>;

export async function deleteTransactionFunction({
  id,
}: DeleteTransactionFunctionRequest): Promise<DeleteTransactionFunctionResponse> {
  try {
    if (!id) {
      throw new Error("Missing id for delete account");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const transactionsToDelete = db.$with("transactions_to_delete").as(
      db
        .select({
          id: transactions.id,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(eq(accounts.userId, userId), eq(transactions.id, id))),
    );

    const data = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToDelete})`),
      )
      .returning();

    if (!data) {
      console.error("Transaction not found");
      throw new Error("Transaction not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to delete transaction", e);
    throw new Error("Failed to delete transaction");
  }
}
