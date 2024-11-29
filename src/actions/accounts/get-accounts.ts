"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export type GetAccountsFunctionResponse = {
  id: number;
  name: string;
  userId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}[];

export async function getAccountsFunction(): Promise<GetAccountsFunctionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const data = await db
      .select({
        id: accounts.id,
        name: accounts.name,
        userId: accounts.userId,
        amount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
        createdAt: accounts.createdAt,
        updatedAt: accounts.updatedAt,
      })
      .from(accounts)
      .leftJoin(transactions, eq(accounts.id, transactions.accountId))
      .where(eq(accounts.userId, userId))
      .groupBy(
        accounts.id,
        accounts.name,
        accounts.userId,
        accounts.createdAt,
        accounts.updatedAt,
      );

    if (!data) {
      console.error("Accounts not found");
      throw new Error("Accounts not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to get accounts", e);
    throw new Error("Failed to get accounts");
  }
}
