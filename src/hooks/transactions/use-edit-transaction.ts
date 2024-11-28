import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  editTransactionFunction,
  EditTransactionFunctionRequest,
  EditTransactionFunctionResponse,
} from "@/actions/transactions/edit-transaction";

export const useEditTransaction = (id?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    EditTransactionFunctionResponse,
    Error,
    EditTransactionFunctionRequest
  >({
    mutationFn: async (values) => {
      return await editTransactionFunction(values);
    },
    onSuccess: () => {
      toast.success("Pomyślnie edytowano transakcję!");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas edycji transakcji");
    },
  });

  return mutation;
};
