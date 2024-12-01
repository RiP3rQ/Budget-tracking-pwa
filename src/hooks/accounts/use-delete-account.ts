import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import {
  deleteAccountFunction,
  DeleteUserFunctionRequest,
  DeleteUserFunctionResponse,
} from "@/actions/accounts/delete-account";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    DeleteUserFunctionResponse,
    Error,
    DeleteUserFunctionRequest
  >({
    mutationFn: async ({ id }) => {
      return await deleteAccountFunction({ id });
    },
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Usunięto konto!",
        { duration: 5000 },
      );
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: Invaliadte analysis and transactions
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania konta");
    },
  });

  return mutation;
};
