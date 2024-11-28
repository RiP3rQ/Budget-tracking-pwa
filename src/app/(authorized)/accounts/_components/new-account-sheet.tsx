import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewAccountSheet } from "@/states/account/new-account-sheet-state";
import {
  AccountForm,
  FormValues,
} from "@/app/(dashboard)/budget/accounts/_components/new-account-form";
import { useCreateAccount } from "@/hooks/accounts/use-create-account";

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccountSheet();
  const mutation = useCreateAccount();

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
          <SheetTitle>Nowe konto</SheetTitle>
          <SheetDescription>
            Utwórz nowe konto, aby zacząć śledzić swoje wydatki.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          disabled={mutation.isPending}
          onSubmit={onSubmit}
          defaultValues={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  );
};
