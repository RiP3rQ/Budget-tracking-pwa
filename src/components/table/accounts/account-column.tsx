import { useEditAccountSheet } from "@/states/account/single-account-sheet-state";
import { SelectAccount } from "@/db/schema";

type Props = {
  account: SelectAccount;
};

export const AccountColumn = ({ account }: Readonly<Props>) => {
  const { onOpen } = useEditAccountSheet();

  const onClick = () => {
    if (!account.id) return;
    onOpen(account.id);
  };

  return (
    <div
      onClick={onClick}
      className={"flex items-center cursor-pointer hover:underline"}
    >
      {account.name}
    </div>
  );
};
