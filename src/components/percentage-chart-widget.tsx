import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSearch, Loader2 } from "lucide-react";
import { useState } from "react";
import { ChartTypeSelector } from "@/components/charts/chart-type-selector";
import { PieChartVariant } from "@/components/charts/pie-chart";
import { RadarChartVariant } from "@/components/charts/radar-chart";
import { RadialChartVariant } from "@/components/charts/radial-chart";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
  title: string;
  isLoading: boolean;
};

export const PercentageChartWidget = ({ data, title, isLoading }: Props) => {
  const [chartType, setChartType] = useState(
    "pie" as "pie" | "radar" | "radial",
  );

  const onChartTypeChange = (type: "pie" | "radar" | "radial") => {
    setChartType(type);
  };

  if (isLoading) {
    return PercentageChartWidgetLoading();
  }

  const selectedChart = () => {
    switch (chartType) {
      case "pie":
        return <PieChartVariant data={data} />;
      case "radar":
        return <RadarChartVariant data={data} />;
      case "radial":
        return <RadialChartVariant data={data} />;
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
          onValueChangePercentage={onChartTypeChange}
          variant={"percentage"}
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

const PercentageChartWidgetLoading = () => {
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
