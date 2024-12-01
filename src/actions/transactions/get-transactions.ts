"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { accounts, categories, transactions } from "@/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import moment from "moment";

export type GetTransactionsFunctionResponse = {
  id: number;
  categoryId: number | null;
  category: {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
  } | null;
  note: string | null;
  amount: string;
  accountId: number;
  account: {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  date: Date;
  payee: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}[];

export type GetTransactionsFunctionRequest = Readonly<{
  dateFrom?: string;
  dateTo?: string;
  accountId?: string;
}>;

export async function getTransactionsFunction({
  dateFrom,
  dateTo,
  accountId,
}: GetTransactionsFunctionRequest): Promise<GetTransactionsFunctionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const defaultTo = new Date();
    const defaultFrom = moment(defaultTo).subtract(1, "month").toDate();

    const startDate = dateFrom ? moment(dateFrom).toDate() : defaultFrom;
    const endDate = dateTo ? moment(dateTo).toDate() : defaultTo;

    const data = await db
      .select({
        id: transactions.id,
        categoryId: transactions.categoryId,
        category: categories,
        note: transactions.note,
        amount: transactions.amount,
        accountId: transactions.accountId,
        account: accounts,
        date: transactions.date,
        payee: transactions.payee,
        userId: transactions.userId,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, Number(accountId)) : undefined,
          eq(accounts.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      );

    if (!data) {
      console.error("Categories not found");
      throw new Error("Categories not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to get categories", e);
    throw new Error("Failed to get categories");
  }
}
