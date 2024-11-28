import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import {
  editAccountFunction,
  EditUserFunctionRequest,
  EditUserFunctionResponse,
} from "@/actions/accounts/edit-account";

export const useEditAccount = (id?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    EditUserFunctionResponse,
    Error,
    EditUserFunctionRequest
  >({
    mutationFn: async ({ id, name }) => {
      return await editAccountFunction({ id, name });
    },
    onSuccess: () => {
      toast.success("Pomyślnie edytowano konto!");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas edycji konta");
    },
  });

  return mutation;
};
