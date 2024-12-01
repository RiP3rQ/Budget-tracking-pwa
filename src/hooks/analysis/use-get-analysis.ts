"use client";

import { useQuery } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import {
  GetAnalysisFunctionResponse,
  getAnalyticsFunction,
} from "@/actions/analysis/get-analysis";

export const useGetAnalysis = () => {
  const params = useSearchParams();
  const dateFrom = params.get("dateFrom") || "";
  const dateTo = params.get("dateTo") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery<GetAnalysisFunctionResponse, Error>({
    queryKey: ["summary", { dateFrom, dateTo, accountId }],
    queryFn: async () => {
      return await getAnalyticsFunction({ dateFrom, dateTo, accountId });
    },
  });

  return query;
};
