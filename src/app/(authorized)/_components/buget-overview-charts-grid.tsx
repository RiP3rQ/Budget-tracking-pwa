"use client";

import { useSearchParams } from "next/navigation";
import { formatDateRange } from "@/lib/utils";
import { useGetSummary } from "@/actions/budget/summary/use-get-summary";
import { TransactionsChartWidget } from "@/app/(dashboard)/budget/_components/transactions-chart-widget";
import { PercentageChartWidget } from "@/app/(dashboard)/budget/_components/percentage-chart-widget"; // TODO: FETCH DATA ONCE ON PAGE LOAD AND SEND TO COMPONENTS

// TODO: FETCH DATA ONCE ON PAGE LOAD AND SEND TO COMPONENTS

export const BudgetOverviewChartsGrid = () => {
  const { data, isLoading } = useGetSummary();
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const dateRangeLabel = formatDateRange({ to, from });

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
