import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bulkCreateTransactionsFunction,
  BulkCreateTransactionsFunctionRequest,
  BulkCreateTransactionsFunctionResponse,
} from "@/actions/transactions/bulk-create-transactions";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

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
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Utworzono wiele transakcji!",
        { duration: 5000 },
      );
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
