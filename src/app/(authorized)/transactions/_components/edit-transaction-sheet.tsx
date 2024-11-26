import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ApiFormValues,
  TransactionForm,
} from "@/app/(dashboard)/budget/transactions/_components/new-transaction-form";
import { Loader2 } from "lucide-react";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { useGetSingleTransaction } from "@/actions/budget/transactions/use-get-single-transaction";
import { useEditTransaction } from "@/actions/budget/transactions/use-edit-transaction";
import { useDeleteTransaction } from "@/actions/budget/transactions/use-delete-transaction";
import { useEditTransactionSheet } from "@/actions/budget/transactions/state/single-transaction-sheet-state";
import { convertMiliUnitsToAmount } from "@/lib/utils";
import { useCreateAccount } from "@/actions/budget/accounts/use-create-account";
import { useGetAccounts } from "@/actions/budget/accounts/use-get-accounts";
import { useCreateCategory } from "@/actions/budget/categories/use-create-category";
import { useGetCategories } from "@/actions/budget/categories/use-get-categories";

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useEditTransactionSheet();
  const transactionsQuery = useGetSingleTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);
  const [ConfirmationDialog, confirm] = useConfirmModal(
    "Usuń transakcję!",
    "Czy na pewno chcesz usunąć tą transakcję?",
  );

  // categories part ----
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryQuery = useGetCategories();
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: String(category.id),
  }));

  // accounts part ----
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountsQuery = useGetAccounts();
  const accountsOptions = (accountsQuery.data ?? []).map((account) => ({
    label: account.name,
    value: String(account.id),
  }));

  const isPending =
    categoryQuery.isPending ||
    accountsQuery.isPending ||
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionsQuery.isLoading;
  const isLoading =
    categoryQuery.isLoading ||
    accountsQuery.isLoading ||
    transactionsQuery.isLoading;

  const onSubmit = (values: ApiFormValues) => {
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

  const defaultValues = transactionsQuery.data
    ? {
        categoryId: String(transactionsQuery.data.categoryId),
        note: transactionsQuery.data.note,
        amount: String(convertMiliUnitsToAmount(transactionsQuery.data.amount)),
        accountId: String(transactionsQuery.data.accountId),
        date: transactionsQuery.data.date
          ? new Date(transactionsQuery.data.date)
          : new Date(),
        payee: transactionsQuery.data.payee,
      }
    : {
        categoryId: null,
        note: "",
        amount: "0",
        accountId: "0",
        date: new Date(),
        payee: "",
      };

  return (
    <>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className={"space-y-4"}>
          <SheetHeader>
            <SheetTitle>Edytuj Transakcję</SheetTitle>
            <SheetDescription>
              Edytuj szczegóły transakcji, aby zaktualizować dane.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div
              className={"absolute inset-0 flex items-center justify-center"}
            >
              <Loader2 className={"size-6 text-slate-300 animate-spin"} />
            </div>
          ) : (
            <TransactionForm
              id={id}
              disabled={isPending}
              onSubmit={onSubmit}
              onDelete={onDelete}
              categoryOptions={categoryOptions}
              accountOptions={accountsOptions}
              onCreateAccount={onCreateAccount}
              onCreateCategory={onCreateCategory}
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
