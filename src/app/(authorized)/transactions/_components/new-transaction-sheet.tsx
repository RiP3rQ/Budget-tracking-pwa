import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewTransactionSheet } from "@/states/transactions/new-transaction-sheet-state";
import {
  ApiFormValues,
  TransactionForm,
} from "@/app/(dashboard)/budget/transactions/_components/new-transaction-form";
import { useCreateTransaction } from "@/hooks/transactions/use-create-transaction";
import { useGetCategories } from "@/hooks/categories/use-get-categories";
import { useCreateCategory } from "@/hooks/categories/use-create-category";
import { useCreateAccount } from "@/hooks/accounts/use-create-account";
import { useGetAccounts } from "@/hooks/accounts/use-get-accounts";
import { Loader2 } from "lucide-react";

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransactionSheet();
  const createMutation = useCreateTransaction();

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
    createMutation.isPending;
  const isLoading = categoryQuery.isLoading || accountsQuery.isLoading;

  const onSubmit = (values: ApiFormValues) => {
    console.log("values", values);
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className={"space-y-4"}>
        <SheetHeader>
          <SheetTitle>Nowa transakcja</SheetTitle>
          <SheetDescription>
            Dodaj nową transakcję, aby śledzić swoje wydatki.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className={"absolute inset-0 flex items-center justify-center"}>
            <Loader2 className={"size-6 text-slate-300 animate-spin"} />
          </div>
        ) : (
          <TransactionForm
            disabled={isPending}
            onSubmit={onSubmit}
            categoryOptions={categoryOptions}
            accountOptions={accountsOptions}
            onCreateAccount={onCreateAccount}
            onCreateCategory={onCreateCategory}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
