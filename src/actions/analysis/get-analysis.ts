"use server";

import { auth } from "@clerk/nextjs/server";
import { differenceInDays, parse, subDays } from "date-fns";
import { fetchFinancialData } from "@/actions/analysis/fetch-financial-data";
import { calculatePercentageChange } from "@/lib/percentages";
import { db } from "@/db";
import { accounts, categories, transactions } from "@/db/schema";
import { and, desc, eq, gte, lt, lte, sql } from "drizzle-orm";
import { fillMissingDays } from "@/lib/dates";

export type GetAnalysisFunctionResponse = Readonly<{
  incomeAmount: number;
  expenseAmount: number;
  balanceAmount: number;
  remainingAmount: number;
  incomeChange: number;
  expenseChange: number;
  balanceChange: number;
  remainingChange: number;
  topCategories: Array<{
    name: string;
    value: number;
  }>;
  topCategoriesSum: number;
  otherCategories: Array<{
    name: string;
    value: number;
  }>;
  othersSum: number;
  finalCategories: Array<{
    name: string;
    value: number;
  }>;
  days: Array<{
    date: string;
    income: number;
    expense: number;
  }>;
}>;
export type GetAnalysisFunctionRequest = Readonly<{
  dateFrom?: string;
  dateTo?: string;
  accountId?: string;
}>;

export async function getAnalyticsFunction({
  dateFrom,
  dateTo,
  accountId,
}: GetAnalysisFunctionRequest): Promise<GetAnalysisFunctionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // dates
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);
    const startDate = dateFrom
      ? parse(dateFrom, "yyyy-MM-dd", new Date())
      : defaultFrom;
    const endDate = dateTo
      ? parse(dateTo, "yyyy-MM-dd", new Date())
      : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    //accountId
    const parsedAccountId = accountId ? parseInt(accountId, 10) : undefined;

    // periods data fetching
    const currentPeriodData = await fetchFinancialData({
      userId: userId,
      accountId: parsedAccountId,
      startDate: startDate,
      endDate: endDate,
    });
    const lastPeriodData = await fetchFinancialData({
      userId: userId,
      accountId: parsedAccountId,
      startDate: lastPeriodStart,
      endDate: lastPeriodEnd,
    });

    if (!currentPeriodData || !lastPeriodData) {
      console.error("Summary not found");
      throw new Error("Summary not found");
    }

    // calculate percentage change
    const incomeChange = calculatePercentageChange(
      currentPeriodData.income,
      lastPeriodData.income,
    );
    const expenseChange = calculatePercentageChange(
      currentPeriodData.expense,
      lastPeriodData.expense,
    );
    const balanceChange = calculatePercentageChange(
      currentPeriodData.balance,
      lastPeriodData.balance,
    );
    const remainingChange = calculatePercentageChange(
      currentPeriodData.remaining,
      lastPeriodData.remaining,
    );

    // values by category
    const categoriesValues = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(
                ${transactions.amount}
                )
                )`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          parsedAccountId
            ? eq(transactions.accountId, parsedAccountId)
            : undefined,
          eq(accounts.userId, userId),
          lt(transactions.amount, "0"),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      )
      .groupBy(categories.name)
      .orderBy(
        desc(sql`SUM(ABS(
                ${transactions.amount}
                )
                )`),
      );

    const activeDays = await db
      .select({
        date: transactions.date,
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
                ABS
                (
                ${transactions.amount}
                )
                ELSE
                0
                END
                )`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          parsedAccountId
            ? eq(transactions.accountId, parsedAccountId)
            : undefined,
          eq(accounts.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    const topCategories = categoriesValues.slice(0, 3);
    const topCategoriesSum = topCategories.reduce(
      (acc, category) => acc + category.value,
      0,
    );
    const otherCategories = categoriesValues.slice(3);
    const othersSum = otherCategories.reduce(
      (acc, category) => acc + category.value,
      0,
    );

    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({ name: "Others", value: othersSum });
    }

    const days = fillMissingDays(activeDays, startDate, endDate);

    return {
      incomeAmount: currentPeriodData.income,
      expenseAmount: currentPeriodData.expense,
      balanceAmount: currentPeriodData.balance,
      remainingAmount: currentPeriodData.remaining,
      incomeChange,
      expenseChange,
      balanceChange,
      remainingChange,
      topCategories,
      topCategoriesSum,
      otherCategories,
      othersSum,
      finalCategories,
      days,
    };
  } catch (e) {
    console.error("Failed to fetch analytics", e);
    throw new Error("Failed to fetch analytics");
  }
}
