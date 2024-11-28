import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteCategoryFunction,
  DeleteCategoryFunctionRequest,
  DeleteCategoryFunctionResponse,
} from "@/actions/categories/delete-category";

export const useDeleteCategory = (id?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    DeleteCategoryFunctionResponse,
    Error,
    DeleteCategoryFunctionRequest
  >({
    mutationFn: async () => {
      return await deleteCategoryFunction({ id });
    },
    onSuccess: () => {
      toast.success("Pomyślnie usunięto kategorię!");
      queryClient.invalidateQueries({
        queryKey: [
          "category",
          {
            id,
          },
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      // TODO: Invaliadte analysis and transactions
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania kategorii");
    },
  });

  return mutation;
};
