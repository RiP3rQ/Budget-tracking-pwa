import { useQuery } from "@tanstack/react-query";
import {
  getSingleAccountFunction,
  SingleAccountFunctionResponse,
} from "@/actions/accounts/get-single-account";

export const useGetSingleAccount = (id?: number) => {
  const query = useQuery<SingleAccountFunctionResponse, Error>({
    enabled: !!id,
    queryKey: ["account", { id }],
    queryFn: async () => {
      return await getSingleAccountFunction({ id });
    },
  });

  return query;
};
