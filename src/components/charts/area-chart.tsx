import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { format } from "date-fns";
import { CustomTooltip } from "@/components/charts/custom-tooltip";

type Props = {
  data?: {
    date: string;
    income: number;
    expense: number;
  }[];
};

export const AreaChartVariant = ({ data }: Props) => {
  console.log("@AreaChartVariant", data);
  return (
    <ResponsiveContainer width="100%" height={384}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id={"expense"} x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"2%"} stopColor={"#f43f5e"} stopOpacity={0.8} />
            <stop offset={"98%"} stopColor={"#f43f5e"} stopOpacity={0} />
          </linearGradient>
          <linearGradient id={"income"} x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"2%"} stopColor={"#3d82f6"} stopOpacity={0.8} />
            <stop offset={"98%"} stopColor={"#3d82f6"} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey={"date"}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "0.75rem" }}
          tickMargin={16}
        />
        <Tooltip content={CustomTooltip} />
        <Area
          type={"monotone"}
          dataKey={"expense"}
          stackId={"expense"}
          strokeWidth={2}
          stroke={"#f43f5e"}
          fill={"url(#expense)"}
          className={"drop-shadow-sm"}
        />
        <Area
          type={"monotone"}
          dataKey={"income"}
          stackId={"income"}
          strokeWidth={2}
          stroke={"#3d82f6"}
          fill={"url(#income)"}
          className={"drop-shadow-sm"}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
