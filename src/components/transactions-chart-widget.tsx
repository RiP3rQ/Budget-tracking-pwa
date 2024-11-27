"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch, Loader2 } from "lucide-react";
import { AreaChartVariant } from "@/components/charts/area-chart";
import { useState } from "react";
import { ChartTypeSelector } from "@/components/charts/chart-type-selector";
import { BarChartVariant } from "@/components/charts/bar-chart";
import { LineChartVariant } from "@/components/charts/line-chart";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  data?: {
    date: string;
    income: number;
    expense: number;
  }[];
  title: string;
  isLoading: boolean;
};

export const TransactionsChartWidget = ({ data, title, isLoading }: Props) => {
  const [chartType, setChartType] = useState("area" as "area" | "bar" | "line");

  const onChartTypeChange = (type: "area" | "bar" | "line") => {
    // TODO: add paywall
    setChartType(type);
  };

  if (isLoading) {
    return <TransactionsChartWidgetLoading />;
  }

  const selectedChart = () => {
    switch (chartType) {
      case "area":
        return <AreaChartVariant data={data} />;
      case "bar":
        return <BarChartVariant data={data} />;
      case "line":
        return <LineChartVariant data={data} />;
    }
  };

  return (
    <Card className={"border-none drop-shadow-sm"}>
      <CardHeader
        className={
          "flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between"
        }
      >
        <CardTitle className={"text-xl line-clamp-1"}>{title}</CardTitle>
        <ChartTypeSelector
          defaultValue={chartType}
          onValueChange={onChartTypeChange}
          variant={"default"}
        />
      </CardHeader>
      <CardContent>
        {data?.length === 0 ? (
          <div
            className={"flex flex-col justify-center items-center h-96 w-full"}
          >
            <FileSearch className={"size-6 text-muted-foreground"} />
            <p className={"text-muted-foreground text-sm"}>
              Brak danych do wyświetlenia
            </p>
          </div>
        ) : (
          selectedChart()
        )}
      </CardContent>
    </Card>
  );
};

const TransactionsChartWidgetLoading = () => {
  return (
    <Card className={"border-none drop-shadow-sm"}>
      <CardHeader
        className={
          "flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between"
        }
      >
        <Skeleton className={"w-48 h-8"} />
        <Skeleton className={"w-full lg:w-32 h-8"} />
      </CardHeader>
      <CardContent>
        <div className={"h-96 w-full flex items-center justify-center"}>
          <Loader2 className={"size-6 text-muted-foreground animate-spin"} />
        </div>
      </CardContent>
    </Card>
  );
};
