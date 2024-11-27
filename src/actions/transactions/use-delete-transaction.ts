import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

export const useDeleteTransaction = (id?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (values) => {
      const parsedId = String(id) || undefined;
      const response = await client.api.transactions[":id"]["$delete"]({
        param: { id: parsedId },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Pomyślnie usunięto transakcję!");
      queryClient.invalidateQueries({
        queryKey: [
          "transaction",
          {
            id,
          },
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania transakcji");
    },
  });

  return mutation;
};
