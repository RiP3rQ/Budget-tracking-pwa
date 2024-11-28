"use client";

import { useGetAnalysis } from "@/hooks/analysis/use-get-analysis";
import { formatDateRange } from "@/lib/dates";
import { GridDataCard } from "@/components/grid-data-card";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

export const BudgetOverviewDataGrid = () => {
  const { data, isLoading } = useGetAnalysis();
  const params = useSearchParams();
  const from = params.get("dateFrom") || "";
  const to = params.get("dateTo") || "";

  const dateRangeLabel = formatDateRange({ to, from });

  return (
    <div className={"grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8"}>
      <GridDataCard
        title={"Pozostało do wydania"}
        value={data?.remainingAmount || "Brak danych"}
        currency={"PLN"}
        percentageChange={data?.remainingChange || "Brak danych"}
        icon={PiggyBankIcon}
        variant={"default"}
        dateRange={dateRangeLabel}
        isLoading={isLoading}
      />
      <GridDataCard
        title={"Przychód"}
        value={data?.incomeAmount || "Brak danych"}
        currency={"PLN"}
        percentageChange={data?.incomeChange || "Brak danych"}
        icon={TrendingUpIcon}
        variant={"default"}
        dateRange={dateRangeLabel}
        isLoading={isLoading}
      />
      <GridDataCard
        title={"Wydatki"}
        value={data?.expenseAmount || "Brak danych"}
        currency={"PLN"}
        percentageChange={data?.expenseChange || "Brak danych"}
        icon={TrendingDownIcon}
        variant={"default"}
        dateRange={dateRangeLabel}
        isLoading={isLoading}
      />
    </div>
  );
};
