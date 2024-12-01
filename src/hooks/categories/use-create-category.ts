import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategoryFunction,
  CreateCategoryFunctionRequest,
  CreateCategoryFunctionResponse,
} from "@/actions/categories/create-category";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";
import { toast } from "sonner";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    CreateCategoryFunctionResponse,
    Error,
    CreateCategoryFunctionRequest
  >({
    mutationFn: async ({ name, description }) => {
      return await createCategoryFunction({ name, description });
    },
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Dodano nową kategorię!",
        { duration: 5000 },
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas dodawania kategorii");
    },
  });

  return mutation;
};
