import { useEditCategorySheet } from "@/states/categories/single-category-sheet-state";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditTransactionSheet } from "@/states/transactions/single-transaction-sheet-state";
import { SelectCategory } from "@/db/schema";

type Props = {
  id: number;
  category: SelectCategory;
};

export const CategoryColumn = ({ id, category }: Readonly<Props>) => {
  const { onOpen } = useEditCategorySheet();
  const { onOpen: onOpenTransactionEdit } = useEditTransactionSheet();

  const onClick = () => {
    if (!category.id) {
      onOpenTransactionEdit(id);
      return;
    }
    onOpen(category.id);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !category && "text-rose-500",
      )}
    >
      {!category && <TriangleAlert className={"mr-2 size-4 shrink-0"} />}
      {category.name || "Brak kategorii"}
    </div>
  );
};
