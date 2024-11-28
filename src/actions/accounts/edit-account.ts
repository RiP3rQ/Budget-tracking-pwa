import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)[":id"]["$patch"]
>["json"];

export const editAccount = (id?: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (values) => {
      const parsedId = String(id) || undefined;
      const response = await client.api.accounts[":id"]["$patch"]({
        param: { id: parsedId },
        json: values,
      });
      return await response.json();
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
