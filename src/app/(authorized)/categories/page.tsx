"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/categories/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewCategorySheet } from "@/states/categories/new-category-sheet-state";
import { useDeleteCategories } from "@/hooks/categories/use-bulk-delete-categories";
import { useGetCategories } from "@/hooks/categories/use-get-categories";
import { useInitNotifications } from "@/lib/send-toast-and-push-notification";

const CategoriesPage = () => {
  const newCategorySheet = useNewCategorySheet();
  const deleteCategories = useDeleteCategories();
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data ?? [];

  const isDisabled = deleteCategories.isPending || categoriesQuery.isLoading;

  function NotificationInitializer() {
    useInitNotifications();
    return null;
  }

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
          <CardTitle>Kategorie</CardTitle>
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
            filterKey={"nazwie"}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteCategories.mutate({ idsArray: ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
      <NotificationInitializer />
    </div>
  );
};
export default CategoriesPage;
