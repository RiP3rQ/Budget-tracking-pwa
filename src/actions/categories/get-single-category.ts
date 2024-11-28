import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export type SingleCategoryFunctionResponse = Readonly<{
  id: number;
  name: string;
  description: string | null;
  userId: string;
}>;
export type SingleCategoryFunctionRequest = Readonly<{
  id?: number;
}>;

export async function getSingleCategoryFunction({
  id,
}: SingleCategoryFunctionRequest): Promise<SingleCategoryFunctionResponse> {
  try {
    if (!id) {
      throw new Error("Id is required");
    }

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [data] = await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        userId: categories.userId,
      })
      .from(categories)
      .where(and(eq(categories.userId, userId), eq(categories.id, id)));

    if (!data) {
      console.error("Category not found");
      throw new Error("Category not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to get single category", e);
    throw new Error("Failed to get single category");
  }
}
