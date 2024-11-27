import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AccountForm,
  FormValues,
} from "@/app/(dashboard)/budget/accounts/_components/new-account-form";
import { useEditAccountSheet } from "@/states/account/single-account-sheet-state";
import { useGetSingleAccount } from "@/actions/budget/accounts/use-get-single-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "@/actions/budget/accounts/use-edit-account";
import { useDeleteAccount } from "@/actions/budget/accounts/use-delete-account";
import { useConfirmModal } from "@/hooks/use-confirm-modal";

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useEditAccountSheet();
  const accountQuery = useGetSingleAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);
  const [ConfirmationDialog, confirm] = useConfirmModal(
    "Usuń konto!",
    "Czy na pewno chcesz usunąć konto? Wszystkie transakcje związane z tym kontem zostaną usunięte.",
  );

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name,
      }
    : {
        name: "",
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className={"space-y-4"}>
          <SheetHeader>
            <SheetTitle>Edytuj konto</SheetTitle>
            <SheetDescription>
              Edytuj konto, aby zmienić szczegóły konta.
            </SheetDescription>
          </SheetHeader>
          {accountQuery.isLoading ? (
            <div className={"w-full flex items-center justify-center"}>
              <Loader2 className={"size-6 text-slate-300 animate-spin"} />
            </div>
          ) : (
            <AccountForm
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
