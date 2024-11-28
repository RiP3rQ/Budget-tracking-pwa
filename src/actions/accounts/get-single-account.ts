import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type SingleAccountFunctionResponse = Readonly<{
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>;
export type SingleAccountFunctionRequest = Readonly<{
  id?: number;
}>;

export async function getSingleAccountFunction({
  id,
}: SingleAccountFunctionRequest): Promise<SingleAccountFunctionResponse> {
  try {
    if (!id) {
      throw new Error("Id is required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [data] = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.userId, userId), eq(accounts.id, id)));

    if (!data) {
      console.error("Accounts not found");
      throw new Error("Accounts not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to get single account", e);
    throw new Error("Failed to get single account");
  }
}
