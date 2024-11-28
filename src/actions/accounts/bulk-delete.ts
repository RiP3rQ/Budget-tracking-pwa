import "server-only";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";

export type BulkDeleteFunctionResponse = ReadonlyArray<{ name: string }>;
export type BulkDeleteFunctionRequest = Readonly<{
  idsArray: number[];
}>;

export async function bulkDeleteFunction({
  idsArray,
}: BulkDeleteFunctionRequest): Promise<BulkDeleteFunctionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const data = await db
      .delete(accounts)
      .where(and(eq(accounts.userId, userId), inArray(accounts.id, idsArray)))
      .returning({ name: accounts.name });

    if (!data) {
      console.error("Accounts not found");
      throw new Error("Accounts not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to bulk delete accounts", e);
    throw new Error("Failed to bulk delete accounts");
  }
}
