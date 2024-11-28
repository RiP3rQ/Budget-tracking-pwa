import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type DeleteUserFunctionResponse = Readonly<{
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>;
export type DeleteUserFunctionRequest = Readonly<{
  id?: number;
}>;

export async function deleteAccountFunction({
  id,
}: DeleteUserFunctionRequest): Promise<DeleteUserFunctionResponse> {
  try {
    if (!id) {
      throw new Error("Missing id for delete account");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [data] = await db
      .delete(accounts)
      .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))
      .returning();

    if (!data) {
      console.error("Account not found");
      throw new Error("Account not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to delete account", e);
    throw new Error("Failed to delete account");
  }
}
