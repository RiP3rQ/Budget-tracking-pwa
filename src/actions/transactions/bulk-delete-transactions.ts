"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";

export type BulkDeleteTransactionsFunctionResponse = Readonly<{
  id: number;
}>;
export type BulkDeleteTransactionsFunctionRequest = Readonly<{
  idsArray: number[];
}>;

export async function bulkDeleteCategoriesFunction({
  idsArray,
}: BulkDeleteTransactionsFunctionRequest): Promise<BulkDeleteTransactionsFunctionResponse> {
  try {
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
        .where(
          and(eq(accounts.userId, userId), inArray(transactions.id, idsArray)),
        ),
    );

    const [data] = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToDelete})`),
      )
      .returning({ id: transactions.id });

    if (!data) {
      console.error("Transactions not found");
      throw new Error("Transactions not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to bulk delete transactions", e);
    throw new Error("Failed to bulk delete transactions");
  }
}
