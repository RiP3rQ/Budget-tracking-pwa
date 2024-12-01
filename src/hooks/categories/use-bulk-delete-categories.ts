import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bulkDeleteCategoriesFunction,
  BulkDeleteCategoriesFunctionRequest,
  BulkDeleteCategoriesFunctionResponse,
} from "@/actions/categories/bulk-delete-categories";
import { notificationUtil } from "@/lib/send-toast-and-push-notification";

export const useDeleteCategories = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    BulkDeleteCategoriesFunctionResponse,
    Error,
    BulkDeleteCategoriesFunctionRequest
  >({
    mutationFn: async ({ idsArray }) => {
      return await bulkDeleteCategoriesFunction({ idsArray });
    },
    onSuccess: async () => {
      await notificationUtil.SendToastAndPushNotification(
        "success",
        "Usunięto wiele kategorii!",
        { duration: 5000 },
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania kategorii");
    },
  });

  return mutation;
};
