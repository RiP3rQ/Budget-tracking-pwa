import { useQuery } from "@tanstack/react-query";
import { getSingleTransactionFunction } from "@/actions/transactions/get-single-transaction";

export const useGetSingleTransaction = (id?: number) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      return await getSingleTransactionFunction({
        id,
      });
    },
  });

  return query;
};
