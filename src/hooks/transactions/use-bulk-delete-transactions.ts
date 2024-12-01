import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bulkDeleteCategoriesFunction,
  BulkDeleteTransactionsFunctionRequest,
  BulkDeleteTransactionsFunctionResponse,
} from "@/actions/transactions/bulk-delete-transactions";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

export const useDeleteTransactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    BulkDeleteTransactionsFunctionResponse,
    Error,
    BulkDeleteTransactionsFunctionRequest
  >({
    mutationFn: async (values) => {
      return await bulkDeleteCategoriesFunction(values);
    },
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Usunięto wiele transakcji!",
        { duration: 5000 },
      );
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania transakcji");
    },
  });

  return mutation;
};
