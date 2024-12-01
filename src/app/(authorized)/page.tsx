import { BudgetFilters } from "@/components/filters/budget-filters";
import { BudgetOverviewDataGrid } from "@/components/budget-overview-data-grid";
import { BudgetOverviewChartsGrid } from "@/components/buget-overview-charts-grid";
import { Suspense } from "react";

export default function BudgetPage() {
  return (
    <div className={"max-w-screen-2xl mx-auto w-full pb-10"}>
      <Suspense fallback={<div>Ładowanie...</div>}>
        <BudgetFilters />
        <BudgetOverviewDataGrid />
        <BudgetOverviewChartsGrid />
      </Suspense>
    </div>
  );
}
