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
    // Helper for conditional sum with numeric type
    const sumCase = (condition: string) =>
      sql`COALESCE(SUM(CASE WHEN ${transactions.amount} ${sql.raw(condition)} THEN ${
        transactions.amount
      } ELSE 0 END), 0)::numeric(10,2)`;

    const [data] = await db
      .select({
        // Income: sum of positive transactions
        income: sumCase(">= 0").mapWith(Number),
        // Expense: absolute sum of negative transactions
        expense: sql`ABS(${sumCase("< 0")})`.mapWith(Number),
        // Balance: total sum
        balance:
          sql`COALESCE(SUM(${transactions.amount}), 0)::numeric(10,2)`.mapWith(
            Number,
          ),
        // Remaining: income minus absolute expense
        remaining: sql`${sumCase("> 0")} + ${sumCase("< 0")}`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          ...[
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate),
          ].filter(Boolean),
        ),
      );

    return {
      income: Number(data.income) || 0,
      expense: Math.abs(Number(data.expense)) || 0,
      balance: Number(data.balance) || 0,
      remaining: Number(data.remaining) || 0,
    };
  } catch (error) {
    console.error("Failed to fetch financial data:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch financial data: ${error.message}`
        : "Failed to fetch financial data",
    );
  }
}
