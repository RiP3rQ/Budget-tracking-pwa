import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createUserFunction,
  CreateUserFunctionRequest,
  CreateUserFunctionResponse,
} from "@/actions/accounts/create-account";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateUserFunctionResponse,
    Error,
    CreateUserFunctionRequest
  >({
    mutationFn: async ({ name }) => {
      return await createUserFunction({ name });
    },
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Dodano nowe konto!",
        { duration: 5000 },
      );
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas dodawania konta");
    },
  });

  return mutation;
};
