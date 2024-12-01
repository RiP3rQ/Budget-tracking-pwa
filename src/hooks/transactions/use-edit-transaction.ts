import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  editTransactionFunction,
  EditTransactionFunctionRequest,
  EditTransactionFunctionResponse,
} from "@/actions/transactions/edit-transaction";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

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
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Pomyślnie edytowano transakcję!",
        { duration: 5000 },
      );
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
