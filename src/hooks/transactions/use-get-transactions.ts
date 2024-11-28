import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getTransactionsFunction } from "@/actions/transactions/get-transactions";

export const useGetTransactions = () => {
  const params = useSearchParams();
  const dateFrom = params.get("dateFrom") || "";
  const dateTo = params.get("dateTo") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["transactions", { dateFrom, dateTo, accountId }],
    queryFn: async () => {
      return await getTransactionsFunction({
        dateFrom,
        dateTo,
        accountId,
      });
    },
  });

  return query;
};
