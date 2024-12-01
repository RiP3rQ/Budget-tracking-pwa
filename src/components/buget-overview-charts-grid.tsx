"use client";
import { scan } from "react-scan"; // import this BEFORE react
import React from "react";

import { useGetAnalysis } from "@/hooks/analysis/use-get-analysis";
import { TransactionsChartWidget } from "@/components/transactions-chart-widget";
import { PercentageChartWidget } from "@/components/percentage-chart-widget";

if (typeof window !== "undefined") {
  scan({
    enabled: true,
    log: true, // logs render info to console (default: false)
  });
}

export const BudgetOverviewChartsGrid = () => {
  const { data, isLoading } = useGetAnalysis();

  return (
    <div className={"grid grid-cols-1 lg:grid-cols-6 gap-8"}>
      <div className={"col-span-1 lg:col-span-3 xl:col-span-4"}>
        <TransactionsChartWidget
          data={data?.days}
          title={"Transakcje"}
          isLoading={isLoading}
        />
      </div>
      <div className={"col-span-1 lg:col-span-3 xl:col-span-2"}>
        <PercentageChartWidget
          data={data?.finalCategories}
          title={"Kategorie"}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
