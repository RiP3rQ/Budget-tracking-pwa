import {
  CartesianGrid,
  Line,
  LineChart,
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

export const LineChartVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={384}>
      <LineChart data={data}>
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
        <Line
          dot={false}
          dataKey={"income"}
          stroke={"#3d82f6"}
          strokeWidth={2}
          className={"drop-shadow-sm"}
        />
        <Line
          dot={false}
          dataKey={"expense"}
          stroke={"#f43f5e"}
          strokeWidth={2}
          className={"drop-shadow-sm"}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
