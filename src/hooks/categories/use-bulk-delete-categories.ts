import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bulkDeleteCategoriesFunction,
  BulkDeleteCategoriesFunctionRequest,
  BulkDeleteCategoriesFunctionResponse,
} from "@/actions/categories/bulk-delete-categories";

export const useDeleteCategories = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    BulkDeleteCategoriesFunctionResponse,
    Error,
    BulkDeleteCategoriesFunctionRequest
  >({
    mutationFn: async ({ idsArray }) => {
      return await bulkDeleteCategoriesFunction({ idsArray });
    },
    onSuccess: () => {
      toast.success("Usunięto kategorię!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania kategorii");
    },
  });

  return mutation;
};
