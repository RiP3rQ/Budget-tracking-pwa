"use server";

import { db } from "@/db";
import { accounts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export type CreateUserFunctionResponse = Readonly<{
  name: string;
  userId: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}>;
export type CreateUserFunctionRequest = Readonly<{
  name: string;
}>;

export async function createUserFunction({
  name,
}: CreateUserFunctionRequest): Promise<CreateUserFunctionResponse> {
  try {
    if (!name) {
      throw new Error("Name is required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [data] = await db
      .insert(accounts)
      .values({
        name,
        userId,
      })
      .returning();

    if (!data) {
      console.error("Account not found");
      throw new Error("Account not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to create account", e);
    throw new Error("Failed to create account");
  }
}
