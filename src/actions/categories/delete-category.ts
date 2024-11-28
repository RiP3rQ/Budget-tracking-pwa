"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type DeleteCategoryFunctionResponse = Readonly<{
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>;
export type DeleteCategoryFunctionRequest = Readonly<{
  id?: number;
}>;

export async function deleteCategoryFunction({
  id,
}: DeleteCategoryFunctionRequest): Promise<DeleteCategoryFunctionResponse> {
  try {
    if (!id) {
      throw new Error("Missing id for delete account");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [data] = await db
      .delete(categories)
      .where(and(eq(categories.userId, userId), eq(categories.id, id)))
      .returning();

    if (!data) {
      console.error("Category not found");
      throw new Error("Category not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to delete category", e);
    throw new Error("Failed to delete category");
  }
}
