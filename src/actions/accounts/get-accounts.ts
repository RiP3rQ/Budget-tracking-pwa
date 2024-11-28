import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export type GetAccountsFunctionResponse = Readonly<
  {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }[]
>;

export async function getAccountsFunction(): Promise<GetAccountsFunctionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const data = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId));

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
