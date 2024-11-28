import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type EditUserFunctionResponse = Readonly<{
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>;
export type EditUserFunctionRequest = Readonly<{
  id: number;
  name: string;
}>;

export async function editAccountFunction({
  id,
  name,
}: EditUserFunctionRequest): Promise<EditUserFunctionResponse> {
  try {
    if (!id) {
      throw new Error("Missing id for delete account");
    }

    if (!name) {
      throw new Error("Name is required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [data] = await db
      .update(accounts)
      .set({ name })
      .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))
      .returning();

    if (!data) {
      console.error("Account not found");
      throw new Error("Account not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to edit account", e);
    throw new Error("Failed to edit account");
  }
}
