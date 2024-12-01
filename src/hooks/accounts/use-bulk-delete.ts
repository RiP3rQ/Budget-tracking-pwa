import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bulkDeleteFunction,
  BulkDeleteFunctionRequest,
  BulkDeleteFunctionResponse,
} from "@/actions/accounts/bulk-delete";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

export const useDeleteAccounts = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    BulkDeleteFunctionResponse,
    Error,
    BulkDeleteFunctionRequest
  >({
    mutationFn: async ({ idsArray }) => {
      return await bulkDeleteFunction({ idsArray });
    },
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Usunięto wiele kont!",
        { duration: 5000 },
      );
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania wielu kont");
    },
  });

  return mutation;
};
