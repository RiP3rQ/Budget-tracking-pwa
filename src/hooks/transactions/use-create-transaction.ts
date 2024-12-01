import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import {
  createTransactionsFunction,
  CreateTransactionsFunctionRequest,
  CreateTransactionsFunctionResponse,
} from "@/actions/transactions/create-transaction";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateTransactionsFunctionResponse,
    Error,
    CreateTransactionsFunctionRequest
  >({
    mutationFn: async (values) => {
      return await createTransactionsFunction(values);
    },
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Dodano nową transakcję!",
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
