import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$delete"]
>;

export const useDeleteAccount = (id?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (values) => {
      const parsedId = String(id) || undefined;
      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id: parsedId },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Pomyślnie usunięto konto!");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: Invaliadte summary and transactions
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania konta");
    },
  });

  return mutation;
};
