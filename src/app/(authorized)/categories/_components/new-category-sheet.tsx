import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewCategorySheet } from "@/states/categories/new-category-sheet-state";
import { useCreateCategory } from "@/hooks/categories/use-create-category";
import {
  CategoryForm,
  FormValues,
} from "@/app/(authorized)/categories/_components/new-category-form";

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
