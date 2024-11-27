import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewCategorySheet } from "@/states/categories/new-category-sheet-state";
import {
  CategoryForm,
  FormValues,
} from "@/app/(dashboard)/budget/categories/_components/new-category-form";
import { useCreateCategory } from "@/actions/categories/use-create-category";

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategorySheet();
  const mutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className={"space-y-4"}>
        <SheetHeader>
          <SheetTitle>Nowa kategoria</SheetTitle>
          <SheetDescription>
            Dodaj nową kategorię, aby zorganizować swoje wydatki.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          disabled={mutation.isPending}
          onSubmit={onSubmit}
          defaultValues={{
            name: "",
            description: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
