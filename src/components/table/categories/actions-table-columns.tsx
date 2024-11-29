import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { useEditCategorySheet } from "@/states/categories/single-category-sheet-state";
import { useDeleteCategory } from "@/hooks/categories/use-delete-category";

export const ActionsTableColumns = ({ row }: { row: Row<any> }) => {
  const { onOpen } = useEditCategorySheet();
  const deleteMutation = useDeleteCategory(row.original.id);
  const [ConfirmationDialog, confirm] = useConfirmModal(
    "Usuń kategorię!",
    "Czy na pewno chcesz usunąć kategorię? Wszystkie transakcje związane z tym kontem zostaną usunięte.",
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate({ id: row.original.id });
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => {
              onOpen(row.original.id);
            }}
          >
            <Edit className="mr-2 size-4" />
            Edytuj
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="mr-2 size-4" />
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
