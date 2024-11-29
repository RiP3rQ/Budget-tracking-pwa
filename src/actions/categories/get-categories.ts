"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export type GetCategoriesFunctionResponse = {
  id: number;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}[];

export async function getCategoriesFunction(): Promise<GetCategoriesFunctionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        userId: categories.userId,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(categories)
      .where(eq(categories.userId, userId));

    if (!data) {
      console.error("Categories not found");
      throw new Error("Categories not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to get categories", e);
    throw new Error("Failed to get categories");
  }
}
