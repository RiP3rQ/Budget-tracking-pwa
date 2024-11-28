import { useQuery } from "@tanstack/react-query";
import {
  getSingleCategoryFunction,
  SingleCategoryFunctionResponse,
} from "@/actions/categories/get-single-category";

export const useGetSingleCategory = (id?: number) => {
  const query = useQuery<SingleCategoryFunctionResponse, Error>({
    enabled: !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      return await getSingleCategoryFunction({ id });
    },
  });

  return query;
};
