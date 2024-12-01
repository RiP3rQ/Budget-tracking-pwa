import { useQuery } from "@tanstack/react-query";
import { getTransactionsFunction } from "@/actions/transactions/get-transactions";

export const useGetTransactions = () => {
  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      return await getTransactionsFunction();
    },
  });

  return query;
};
