import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetAccounts } from "@/actions/budget/accounts/use-get-accounts";
import { useCreateAccount } from "@/actions/budget/accounts/use-create-account";
import { CustomSelector } from "@/components/custom-selector";

export const useSelectAccountModal = (): [
  () => JSX.Element,
  () => Promise<unknown>,
] => {
  const accountsQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountsOptions = accountsQuery.data?.map((account) => ({
    value: String(account.id),
    label: account.name,
  }));

  const [promise, setPromise] = useState<{
    resolve: (value: string | undefined) => void;
  } | null>(null);
  const selectValue = useRef<string>();

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wybierz konto</DialogTitle>
          <DialogDescription>
            Proszę wybrać konto, na którym chcesz dokonać operacji.
          </DialogDescription>
        </DialogHeader>
        <CustomSelector
          placeholder={"Wybierz konto"}
          options={accountsOptions}
          onCreate={onCreateAccount}
          onChange={(value) => (selectValue.current = value)}
          disabled={accountMutation.isPending || accountsQuery.isLoading}
        />
        <DialogFooter className={"pt-2"}>
          <Button onClick={handleCancel} variant="outline">
            Anuluj
          </Button>
          <Button onClick={handleConfirm}>Potwierdź</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
