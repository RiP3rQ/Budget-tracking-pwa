import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bulkCreateTransactionsFunction,
  BulkCreateTransactionsFunctionRequest,
  BulkCreateTransactionsFunctionResponse,
} from "@/actions/transactions/bulk-create-transactions";

export const useCreateManyTransactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    BulkCreateTransactionsFunctionResponse,
    Error,
    BulkCreateTransactionsFunctionRequest
  >({
    mutationFn: async (values) => {
      return await bulkCreateTransactionsFunction(values);
    },
    onSuccess: () => {
      toast.success("Utworzono wiele transakcji!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas dodawania transakcji");
    },
  });

  return mutation;
};
