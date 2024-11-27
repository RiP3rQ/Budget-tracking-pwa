import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAccounts } from "@/actions/accounts/use-get-accounts";
import { useGetSummary } from "@/actions/summary/use-get-summary";
import { parseAsString, useQueryState } from "nuqs";

export const AccountFilter = () => {
  const { data, isLoading } = useGetAccounts();
  const { isLoading: isLoadingSummary } = useGetSummary();
  const [account, setAccount] = useQueryState(
    "account",
    parseAsString
      .withOptions({
        shallow: true,
      })
      .withDefault("all"),
  );

  return (
    <Select
      value={account}
      onValueChange={setAccount}
      disabled={isLoading || isLoadingSummary}
    >
      <SelectTrigger
        className={
          "lg:w-auto w-full h-9 rounded-md px-3 font-normal" +
          "bg-white/10 hover:bg-white/20 hover:text-white border-none" +
          "focus:ring-transparent focus:ring-offset-0 outline-none text-white" +
          "focus:bg-white/30 transition"
        }
      >
        <SelectValue placeholder={"Wybierz konto"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"all"}>Wszystkie konta</SelectItem>
        {data?.map((account) => (
          <SelectItem key={account.id} value={String(account.id)}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
