"use client";

import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAccounts } from "@/hooks/accounts/use-get-accounts";
import { useGetAnalysis } from "@/hooks/analysis/use-get-analysis";
import { useAccountFilterState } from "@/hooks/use-account-filter-state";

interface Account {
  id: number;
  name: string;
}

interface AccountFilterProps {
  className?: string;
  onAccountChange?: (accountId: string) => void;
}

const STORAGE_KEY = "selectedAccountId";
const QUERY_KEY = "accountId";
const DEFAULT_VALUE = "all";

export function AccountFilter({
  className,
  onAccountChange,
}: AccountFilterProps) {
  const { data: accounts, isLoading } = useGetAccounts();
  const { isLoading: isLoadingSummary } = useGetAnalysis();

  const handleValueChange = useCallback(
    (value: string) => {
      onAccountChange?.(value);
    },
    [onAccountChange],
  );

  const [account, setAccount] = useAccountFilterState({
    queryKey: QUERY_KEY,
    storageKey: STORAGE_KEY,
    defaultValue: DEFAULT_VALUE,
    onValueChange: handleValueChange,
  });

  return (
    <Select
      value={account}
      onValueChange={setAccount}
      disabled={isLoading || isLoadingSummary}
    >
      <SelectTrigger
        className={[
          "lg:w-auto w-full h-9 rounded-md px-3 font-normal",
          "bg-white/10 hover:bg-white/20 hover:text-white border-none",
          "focus:ring-transparent focus:ring-offset-0 outline-none text-white",
          "focus:bg-white/30 transition",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <SelectValue placeholder="Wybierz konto" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Wszystkie konta</SelectItem>
        {accounts?.map((account) => (
          <SelectItem key={account.id} value={String(account.id)}>
            {account.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
