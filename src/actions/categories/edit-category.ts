import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type EditCategoryFunctionResponse = Readonly<{
  id: number;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>;
export type EditCategoryFunctionRequest = Readonly<{
  id?: number;
  name: string;
  description?: string;
}>;

export async function editCategoryFunction({
  id,
  name,
  description,
}: EditCategoryFunctionRequest): Promise<EditCategoryFunctionResponse> {
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
      .update(categories)
      .set({ name, description: description || null })
      .where(and(eq(categories.userId, userId), eq(categories.id, id)))
      .returning();

    if (!data) {
      console.error("Category not found");
      throw new Error("Category not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to edit category", e);
    throw new Error("Failed to edit category");
  }
}
