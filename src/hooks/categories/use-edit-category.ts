import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  editCategoryFunction,
  EditCategoryFunctionRequest,
  EditCategoryFunctionResponse,
} from "@/actions/categories/edit-category";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

export const useEditCategory = (id?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    EditCategoryFunctionResponse,
    Error,
    EditCategoryFunctionRequest
  >({
    mutationFn: async ({ name, description }) => {
      return await editCategoryFunction({ id, name, description });
    },
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Pomyślnie edytowano kategorię!",
        { duration: 5000 },
      );
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas edycji kategorii");
    },
  });

  return mutation;
};
