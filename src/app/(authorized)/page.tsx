import { BudgetOverviewDataGrid } from "@/app/(dashboard)/budget/_components/budget-overview-data-grid";
import { BudgetOverviewChartsGrid } from "@/app/(dashboard)/budget/_components/buget-overview-charts-grid";
import { BudgetFilters } from "@/app/(dashboard)/budget/_components/budget-filters";

export default function BudgetPage() {
  return (
    <div className={"max-w-screen-2xl mx-auto w-full pb-10"}>
      <BudgetFilters />
      <BudgetOverviewDataGrid />
      <BudgetOverviewChartsGrid />
    </div>
  );
}
