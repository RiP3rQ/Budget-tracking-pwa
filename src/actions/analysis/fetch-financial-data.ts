import "server-only";
import { db, sql } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";

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
    const data = await db
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
            )::numeric`,
        expense: sql`SUM(CASE WHEN
            ${transactions.amount}
            <
            0
            THEN
            ${transactions.amount}
            ELSE
            0
            END
            )::numeric`,
        balance: sql`SUM(
            ${transactions.amount}
            )`,
        remaining: sql`SUM(CASE WHEN
            ${transactions.amount}
            >
            0
            THEN
            ${transactions.amount}
            ELSE
            0
            END
            )::numeric`,
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
