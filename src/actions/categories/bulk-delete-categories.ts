import "server-only";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";

export type BulkDeleteCategoriesFunctionResponse = ReadonlyArray<{
  name: string;
}>;
export type BulkDeleteCategoriesFunctionRequest = Readonly<{
  idsArray: number[];
}>;

export async function bulkDeleteCategoriesFunction({
  idsArray,
}: BulkDeleteCategoriesFunctionRequest): Promise<BulkDeleteCategoriesFunctionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const data = await db
      .delete(categories)
      .where(
        and(eq(categories.userId, userId), inArray(categories.id, idsArray)),
      )
      .returning({ name: categories.name });

    if (!data) {
      console.error("Categories not found");
      throw new Error("Categories not found");
    }

    return data;
  } catch (e) {
    console.error("Failed to bulk delete categories", e);
    throw new Error("Failed to bulk delete categories");
  }
}
