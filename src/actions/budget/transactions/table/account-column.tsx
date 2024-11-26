import { useEditAccountSheet } from "@/actions/budget/accounts/state/single-account-sheet-state";

type Props = {
  account: string;
  accountId: number;
};

export const AccountColumn = ({ account, accountId }: Props) => {
  const { onOpen } = useEditAccountSheet();

  const onClick = () => {
    if (!accountId) return;
    onOpen(accountId);
  };

  return (
    <div
      onClick={onClick}
      className={"flex items-center cursor-pointer hover:underline"}
    >
      {account}
    </div>
  );
};
