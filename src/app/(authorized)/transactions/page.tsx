"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/transactions/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransactionSheet } from "@/states/transactions/new-transaction-sheet-state";
import { useDeleteTransactions } from "@/hooks/transactions/use-bulk-delete-transactions";
import { useGetTransactions } from "@/hooks/transactions/use-get-transactions";
import { useState } from "react";
import { transactions as transactionSchema } from "@/db/schema";
import { useSelectAccountModal } from "@/hooks/use-select-account-modal";
import { toast } from "sonner";
import { useCreateManyTransactions } from "@/hooks/transactions/use-bulk-create-transactions";
import { ImportCard } from "@/app/(authorized)/transactions/_components/import-csv/import-card";
import { UploadCSVButton } from "@/app/(authorized)/transactions/_components/import-csv/upload-csv-button";
import { useInitNotifications } from "@/lib/send-toast-and-push-notification";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULT = {
  data: [],
  errors: [],
  meta: {},
};

const TransactionsPage = () => {
  // upload csv
  const [ConfirmationDialog, confirm] = useSelectAccountModal();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResult, setImportResult] = useState<
    typeof INITIAL_IMPORT_RESULT
  >(INITIAL_IMPORT_RESULT);
  const onUpload = (results: typeof INITIAL_IMPORT_RESULT) => {
    console.log(results);
    setImportResult(results);
    setVariant(VARIANTS.IMPORT);
  };
  const onCancelImport = () => {
    setImportResult(INITIAL_IMPORT_RESULT);
    setVariant(VARIANTS.LIST);
  };

  // actual page content
  const newTransactionSheet = useNewTransactionSheet();
  const createTransactions = useCreateManyTransactions();
  const deleteTransactions = useDeleteTransactions();
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data ?? [];

  console.log(transactions);

  const isDisabled =
    deleteTransactions.isPending || transactionsQuery.isLoading;

  function NotificationInitializer() {
    useInitNotifications();
    return null;
  }

  // import csv
  const onSubmitImport = async (
    values: (typeof transactionSchema.$inferInsert)[],
  ) => {
    const accountId = await confirm();

    if (!accountId) return toast.error("Proszę wybrać konto, aby kontynuować");

    console.log(values, accountId);

    const data = values.map((value) => ({
      ...value,
      accountId: parseInt(accountId as string),
      amount: parseFloat(value.amount),
    }));

    createTransactions.mutate(
      {
        values: data,
      },
      {
        onSuccess: () => {
          onCancelImport();
        },
      },
    );
  };

  if (transactionsQuery.isLoading) {
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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <ConfirmationDialog />
        <ImportCard
          data={importResult.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return (
    <div className={"max-w-screen-2xl mx-auto w-full pb-10"}>
      <Card className={"border-none drop-shadow-sm"}>
        <CardHeader
          className={"gap-y-2 lg:flex-row lg:items-center lg:justify-between"}
        >
          <CardTitle>Historia transakcji</CardTitle>
          <div className={"flex items-center gap-x-1"}>
            <UploadCSVButton onUpload={onUpload} />
            <Button
              onClick={newTransactionSheet.onOpen}
              variant="default"
              size={"sm"}
            >
              <Plus className={"size-4 mr-2"} />
              Nowa transakcja
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            // @ts-expect-error - problem with accessor Fn type
            columns={columns}
            data={transactions}
            filterKey={"amount"}
            filterKeyPlaceholder={"Szukaj po kwocie"}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ idsArray: ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
      <NotificationInitializer />
    </div>
  );
};
export default TransactionsPage;
