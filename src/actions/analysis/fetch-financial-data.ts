"use server";

import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";

export type FetchFinancialDataResponse = Readonly<{
  income: number;
  expense: number;
  balance: number;
  remaining: number;
}>;
export type FetchFinancialDataRequest = Readonly<{
  userId: string;
  accountId?: number;
  startDate: Date;
  endDate: Date;
}>;

export async function fetchFinancialData({
  userId,
  accountId,
  startDate,
  endDate,
}: FetchFinancialDataRequest): Promise<FetchFinancialDataResponse> {
  try {
    const [data] = await db
      .select({
        income: sql`SUM(CASE WHEN
            ${transactions.amount}
            >=
            0
            THEN
            ${transactions.amount}
            ELSE
            0
            END
            )`.mapWith(Number),
        expense: sql`SUM(CASE WHEN
            ${transactions.amount}
            <
            0
            THEN
            ${transactions.amount}
            ELSE
            0
            END
            )`.mapWith(Number),
        balance: sql`SUM(
            ${transactions.amount}
            )`.mapWith(Number),
        remaining: sql`SUM(CASE WHEN
            ${transactions.amount}
            >
            0
            THEN
            ${transactions.amount}
            ELSE
            0
            END
            )`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      );

    console.log(data);

    return {
      income: data.income || 0,
      expense: data.expense || 0,
      balance: data.balance || 0,
      remaining: data.remaining || 0,
    };
  } catch (e) {
    console.error("Failed to fetch financial data", e);
    throw new Error("Failed to fetch financial data");
  }
}
