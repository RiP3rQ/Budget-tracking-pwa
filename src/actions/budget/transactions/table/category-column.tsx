import { useEditCategorySheet } from "@/actions/budget/categories/state/single-category-sheet-state";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditTransactionSheet } from "@/actions/budget/transactions/state/single-transaction-sheet-state";

type Props = {
  id: number;
  category: string | null;
  categoryId: number | null;
};

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  const { onOpen } = useEditCategorySheet();
  const { onOpen: onOpenTransactionEdit } = useEditTransactionSheet();

  const onClick = () => {
    if (!categoryId) {
      onOpenTransactionEdit(id);
      return;
    }
    onOpen(categoryId);
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
      {category || "Brak kategorii"}
    </div>
  );
};
