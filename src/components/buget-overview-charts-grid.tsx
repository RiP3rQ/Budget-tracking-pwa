import { useGetSummary } from "@/actions/budget/summary/use-get-summary";
import { TransactionsChartWidget } from "@/components/transactions-chart-widget";
import { PercentageChartWidget } from "@/components/percentage-chart-widget";

export const BudgetOverviewChartsGrid = () => {
  const { data, isLoading } = useGetSummary();

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
