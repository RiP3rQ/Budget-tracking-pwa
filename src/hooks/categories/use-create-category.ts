import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCategoryFunction,
  CreateCategoryFunctionRequest,
  CreateCategoryFunctionResponse,
} from "@/actions/categories/create-category";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateCategoryFunctionResponse,
    Error,
    CreateCategoryFunctionRequest
  >({
    mutationFn: async ({ name, description }) => {
      return await createCategoryFunction({ name, description });
    },
    onSuccess: () => {
      toast.success("Dodano nową kategorię!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas dodawania kategorii");
    },
  });

  return mutation;
};
