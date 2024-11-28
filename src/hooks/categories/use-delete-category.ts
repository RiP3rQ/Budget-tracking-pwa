import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;

export const useDeleteCategory = (id?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (values) => {
      const parsedId = String(id) || undefined;
      const response = await client.api.categories[":id"]["$delete"]({
        param: { id: parsedId },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Pomyślnie usunięto kategorię!");
      queryClient.invalidateQueries({
        queryKey: [
          "category",
          {
            id,
          },
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      // TODO: Invaliadte analysis and transactions
    },
    onError: (error) => {
      console.error(error);
      toast.error("Wystąpił błąd podczas usuwania kategorii");
    },
  });

  return mutation;
};
