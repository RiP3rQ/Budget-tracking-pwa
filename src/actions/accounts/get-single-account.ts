import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const getSingleAccount = (id?: number) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["account", { id }],
    queryFn: async () => {
      const parsedId = String(id) || undefined;
      const response = await client.api.accounts[":id"].$get({
        param: { id: parsedId },
      });
      if (!response.ok) {
        throw new Error("Error fetching single account");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
