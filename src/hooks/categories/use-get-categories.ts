import { useQuery } from "@tanstack/react-query";
import {
  getCategoriesFunction,
  GetCategoriesFunctionResponse,
} from "@/actions/categories/get-categories";

export const useGetCategories = () => {
  const query = useQuery<GetCategoriesFunctionResponse, Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      return await getCategoriesFunction();
    },
  });

  return query;
};
