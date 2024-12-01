"use client";
import { useNewAccountSheet } from "@/states/account/new-account-sheet-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";

import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/accounts/columns";
import { useGetAccounts } from "@/hooks/accounts/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteAccounts } from "@/hooks/accounts/use-bulk-delete";
import { useInitNotifications } from "@/lib/send-toast-and-push-notification";

const AccountsPage = () => {
  const newAccountSheet = useNewAccountSheet();
  const deleteAccounts = useDeleteAccounts();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data ?? [];

  const isDisabled = deleteAccounts.isPending || accountsQuery.isLoading;

  function NotificationInitializer() {
    useInitNotifications();
    return null;
  }

  if (accountsQuery.isLoading) {
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

  return (
    <div className={"max-w-screen-2xl mx-auto w-full pb-10"}>
      <Card className={"border-none drop-shadow-sm"}>
        <CardHeader
          className={"gap-y-2 lg:flex-row lg:items-center lg:justify-between"}
        >
          <CardTitle>Konta</CardTitle>
          <Button
            onClick={newAccountSheet.onOpen}
            variant="default"
            size={"sm"}
          >
            <Plus className={"size-4 mr-2"} />
            Nowe konto
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={accounts}
            filterKey={"name"}
            filterKeyPlaceholder={"Szukaj konta po nazwie"}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ idsArray: ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
      <NotificationInitializer />
    </div>
  );
};
export default AccountsPage;
