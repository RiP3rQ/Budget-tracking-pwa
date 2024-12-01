import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import {
  deleteTransactionFunction,
  DeleteTransactionFunctionRequest,
  DeleteTransactionFunctionResponse,
} from "@/actions/transactions/delete-transaction";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

export const useDeleteTransaction = (id?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    DeleteTransactionFunctionResponse,
    Error,
    DeleteTransactionFunctionRequest
  >({
    mutationFn: async (values) => {
      return await deleteTransactionFunction(values);
    },
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Usunięto transakcję!",
        { duration: 5000 },
      );
      queryClient.invalidateQueries({
        queryKey: [
          "transaction",
          {
            id,
          },
        ],
      });
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
