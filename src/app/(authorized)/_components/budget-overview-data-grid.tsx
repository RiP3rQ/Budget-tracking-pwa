"use client";

import { useSearchParams } from "next/navigation";
import { formatDateRange } from "@/lib/utils";
import { FaPiggyBank } from "react-icons/fa";
import { useGetSummary } from "@/actions/budget/summary/use-get-summary";
import { GridDataCard } from "@/app/(dashboard)/budget/_components/grid-data-card";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

export const BudgetOverviewDataGrid = () => {
  const { data, isLoading } = useGetSummary();
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const dateRangeLabel = formatDateRange({ to, from });

  console.log("data", data);

  return (
    <div className={"grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8"}>
      <GridDataCard
        title={"Pozostało do wydania"}
        value={data?.remainingAmount || "Brak danych"}
        currency={"PLN"}
        percentageChange={data?.remainingChange || "Brak danych"}
        icon={FaPiggyBank}
        variant={"default"}
        dateRange={dateRangeLabel}
        isLoading={isLoading}
      />
      <GridDataCard
        title={"Przychód"}
        value={data?.incomeAmount || "Brak danych"}
        currency={"PLN"}
        percentageChange={data?.incomeChange || "Brak danych"}
        icon={FaArrowTrendUp}
        variant={"default"}
        dateRange={dateRangeLabel}
        isLoading={isLoading}
      />
      <GridDataCard
        title={"Wydatki"}
        value={data?.expenseAmount || "Brak danych"}
        currency={"PLN"}
        percentageChange={data?.expenseChange || "Brak danych"}
        icon={FaArrowTrendDown}
        variant={"default"}
        dateRange={dateRangeLabel}
        isLoading={isLoading}
      />
    </div>
  );
};
