import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { useGetSingleCategory } from "@/hooks/categories/use-get-single-category";
import { useEditCategory } from "@/hooks/categories/use-edit-category";
import { useDeleteCategory } from "@/hooks/categories/use-delete-category";
import { useEditCategorySheet } from "@/states/categories/single-category-sheet-state";
import {
  CategoryForm,
  FormValues,
} from "@/app/(authorized)/categories/_components/new-category-form";

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useEditCategorySheet();
  const categoriesQuery = useGetSingleCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);
  const [ConfirmationDialog, confirm] = useConfirmModal(
    "Usuń kategorię!",
    "Czy na pewno chcesz usunąć kategorię? Wszystkie transakcje związane z tym kontem zostaną usunięte.",
  );

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(
      {
        id,
        name: values.name,
        description: values.description,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(
        {
          id,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    }
  };

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const defaultValues = categoriesQuery.data
    ? {
        name: categoriesQuery.data.name,
        description: categoriesQuery.data.description ?? "",
      }
    : {
        name: "",
        description: "",
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className={"space-y-4"}>
          <SheetHeader>
            <SheetTitle>Edytuj kategorię</SheetTitle>
            <SheetDescription>
              Edytuj kategorię, aby lepiej zarządzać swoimi finansami.
            </SheetDescription>
          </SheetHeader>
          {categoriesQuery.isLoading ? (
            <div className={"w-full flex items-center justify-center"}>
              <Loader2 className={"size-6 text-slate-300 animate-spin"} />
            </div>
          ) : (
            <CategoryForm
              id={id}
              disabled={isPending}
              onSubmit={onSubmit}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
