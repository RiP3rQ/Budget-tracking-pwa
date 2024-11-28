import { useQuery } from "@tanstack/react-query";
import { getAccountsFunction } from "@/actions/accounts/get-accounts";

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      return await getAccountsFunction();
    },
  });

  return query;
};
