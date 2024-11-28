"use server";

import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";

export type FetchFinancialDataResponse = Readonly<
  {
    income: number;
    expense: number;
    balance: number;
    remaining: number;
  }[]
>;
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
    const sumCase = (condition: string, column: typeof transactions.amount) =>
      sql`SUM(CASE WHEN ${column} ${sql.raw(condition)} THEN ${column} ELSE 0 END)::numeric`;

    const calculateMetrics = (amount: typeof transactions.amount) => ({
      income: sumCase(">= 0", amount),
      expense: sumCase("< 0", amount),
      balance: sql`SUM(${amount})`,
      remaining: sumCase("> 0", amount),
    });

    const dateRangeFilter = (startDate: Date, endDate: Date) =>
      and(gte(transactions.date, startDate), lte(transactions.date, endDate));

    const data = await db
      .select(calculateMetrics(transactions.amount))
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

    return data.map((row) => ({
      income: Number(row.income) || 0,
      expense: Number(row.expense) || 0,
      balance: Number(row.balance) || 0,
      remaining: Number(row.remaining) || 0,
    }));
  } catch (e) {
    console.error("Failed to fetch financial data", e);
    throw new Error("Failed to fetch financial data");
  }
}
