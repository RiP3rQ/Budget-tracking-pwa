import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChartIcon,
  BarChartIcon,
  LineChartIcon,
  PieChartIcon,
} from "lucide-react";
import { RadarChart, RadialBarChart } from "recharts";

type Props = {
  defaultValue: string;
  onValueChange?: (type: "area" | "bar" | "line") => void;
  onValueChangePercentage?: (type: "pie" | "radar" | "radial") => void;
  variant: "default" | "percentage";
};

export const ChartTypeSelector = ({
  defaultValue,
  onValueChange,
  onValueChangePercentage,
  variant,
}: Props) => {
  const onChange =
    variant === "percentage" ? onValueChangePercentage : onValueChange;

  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger className={"lg:w-auto h-9 rounded-md px-3"}>
        <SelectValue placeholder={"Wybierz typ"} />
      </SelectTrigger>
      <SelectContent>
        {variant === "percentage"
          ? percentageTypeChartOptions()
          : transactionTypeChartOptions()}
      </SelectContent>
    </Select>
  );
};

const transactionTypeChartOptions = () => {
  return (
    <>
      <SelectItem value={"area"}>
        <div className={"flex items-center"}>
          <AreaChartIcon className={"mr-2 shrink-0 size-4"} />
          <p className={"line-clamp-1"}>Obszarowy</p>
        </div>
      </SelectItem>
      <SelectItem value={"bar"}>
        <div className={"flex items-center"}>
          <BarChartIcon className={"mr-2 shrink-0 size-4"} />
          <p className={"line-clamp-1"}>Słupkowy</p>
        </div>
      </SelectItem>
      <SelectItem value={"line"}>
        <div className={"flex items-center"}>
          <LineChartIcon className={"mr-2 shrink-0 size-4"} />
          <p className={"line-clamp-1"}>Liniowy</p>
        </div>
      </SelectItem>
    </>
  );
};

const percentageTypeChartOptions = () => {
  return (
    <>
      <SelectItem value={"pie"}>
        <div className={"flex items-center"}>
          <PieChartIcon className={"mr-2 shrink-0 size-4"} />
          <p className={"line-clamp-1"}>Kołowy</p>
        </div>
      </SelectItem>
      <SelectItem value={"radar"}>
        <div className={"flex items-center"}>
          <RadarChart className={"mr-2 shrink-0 size-4"} />
          <p className={"line-clamp-1"}>Radarowy</p>
        </div>
      </SelectItem>
      <SelectItem value={"radial"}>
        <div className={"flex items-center"}>
          <RadialBarChart className={"mr-2 shrink-0 size-4"} />
          <p className={"line-clamp-1"}>Promieniowy</p>
        </div>
      </SelectItem>
    </>
  );
};
