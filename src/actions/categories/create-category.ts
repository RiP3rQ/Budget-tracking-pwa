"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export type CreateCategoryFunctionResponse = Readonly<{
  name: string;
  description: string | null;
  userId: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}>;
export type CreateCategoryFunctionRequest = Readonly<{
  name: string;
  description?: string | null;
}>;

export async function createCategoryFunction({
  name,
  description,
}: CreateCategoryFunctionRequest): Promise<CreateCategoryFunctionResponse> {
  try {
    if (!name) {
      throw new Error("Name is required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [data] = await db
      .insert(categories)
      .values({
        name,
        description: description || null,
        userId: userId,
      })
      .returning();

    if (!data) {
      console.error("Category not found");
      throw new Error("Category not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to create category", e);
    throw new Error("Failed to create category");
  }
}
