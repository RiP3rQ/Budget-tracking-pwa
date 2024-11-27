import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAccounts } from "@/actions/budget/accounts/use-get-accounts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useGetSummary } from "@/actions/budget/summary/use-get-summary";

export const AccountFilter = () => {
  const { data, isLoading } = useGetAccounts();
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { isLoading: isLoadingSummary } = useGetSummary();

  const accountId = params.get("accountId") ?? "all";
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";

  const onChange = (newValue: string) => {
    const query = {
      accountId: newValue,
      from,
      to,
    };

    if (newValue === "all") {
      query.accountId = "";
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <Select
      value={accountId}
      onValueChange={onChange}
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
