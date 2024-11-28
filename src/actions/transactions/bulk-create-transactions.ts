"use server";

import { db } from "@/db";
import {
  NewTransaction,
  NewTransactionWithProperAmount,
  transactions,
} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export type BulkCreateTransactionsFunctionResponse = Readonly<
  NewTransactionWithProperAmount[]
>;
export type BulkCreateTransactionsFunctionRequest = Readonly<{
  values: NewTransaction[];
}>;

export async function bulkCreateTransactionsFunction({
  values,
}: BulkCreateTransactionsFunctionRequest): Promise<BulkCreateTransactionsFunctionResponse> {
  try {
    if (!values || values.length === 0) {
      throw new Error("Values are required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const data = await db
      .insert(transactions)
      .values(
        values.map((value) => ({
          ...value,
          amount: value.amount.toString(),
        })),
      )
      .returning();

    if (!data) {
      console.error("Transaction not found");
      throw new Error("Transaction not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to bulk create transaction", e);
    throw new Error("Failed to bulk create transaction");
  }
}
