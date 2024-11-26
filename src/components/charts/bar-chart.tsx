import {
  Bar,
  BarChart,
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

export const BarChartVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={384}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={"date"}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => format(value, "dd MMM")}
          style={{ fontSize: "0.75rem" }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={"income"} fill={"#3d82f6"} className={"drop-shadow-sm"} />
        <Bar
          dataKey={"expense"}
          fill={"#f43f5e"}
          className={"drop-shadow-sm"}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
