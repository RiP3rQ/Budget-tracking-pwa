"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

import { DataTable } from "@/components/table/data-table";
import { columns } from "@/actions/budget/categories/table/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewCategorySheet } from "@/actions/budget/categories/state/new-category-sheet-state";
import { useDeleteCategories } from "@/actions/budget/categories/use-bulk-delete-categories";
import { useGetCategories } from "@/actions/budget/categories/use-get-categories";

const CategoriesPage = () => {
  const newCategorySheet = useNewCategorySheet();
  const deleteCategories = useDeleteCategories();
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data ?? [];

  const isDisabled = deleteCategories.isPending || categoriesQuery.isLoading;

  if (categoriesQuery.isLoading) {
    return (
      <div className={"max-w-screen-2xl mx-auto w-full pb-10"}>
        <Card className={"border-none drop-shadow-sm"}>
          <CardHeader
            className={"gap-y-2 lg:flex-row lg:items-center lg:justify-between"}
          >
            <Skeleton className={"w-48 h-8"} />
          </CardHeader>
          <CardContent>
            <div
              className={"h-[500px] w-full flex items-center justify-center"}
            >
              <Loader2 className={"size-6 text-slate-300 animate-spin"} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={"max-w-screen-2xl mx-auto w-full pb-10"}>
      <Card className={"border-none drop-shadow-sm"}>
        <CardHeader
          className={"gap-y-2 lg:flex-row lg:items-center lg:justify-between"}
        >
          <CardTitle>Kategories</CardTitle>
          <Button
            onClick={newCategorySheet.onOpen}
            variant="default"
            size={"sm"}
          >
            <Plus className={"size-4 mr-2"} />
            Nowa kategoria
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categories}
            filterKey={"Name"}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteCategories.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default CategoriesPage;
