import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const getSingleTransaction = (id?: number) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const parsedId = String(id) || undefined;
      const response = await client.api.transactions[":id"].$get({
        param: { id: parsedId },
      });
      if (!response.ok) {
        throw new Error("Error fetching single category");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
