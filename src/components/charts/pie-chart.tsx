import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatPercentage } from "@/lib/utils";
import { CustomPercentageTooltip } from "@/components/charts/percentage-custom-tooltip";

const COLORS = ["#3d82f6", "#f43f5e", "#12c6ff", "#ff9354"];

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export const PieChartVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={384}>
      <PieChart>
        <Legend
          layout={"horizontal"}
          verticalAlign={"bottom"}
          align={"right"}
          iconType={"circle"}
          content={({ payload }: any) => {
            return (
              <ul className={"flex flex-col space-x-4"}>
                {payload.map((entry: any, index: number) => (
                  <li
                    key={`item-${index}`}
                    className={"flex items-center space-x-2"}
                  >
                    <div
                      className={"size-2 rounded-full"}
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className={"space-x-1"}>
                      <span className={"text-sm text-muted-foreground"}>
                        {entry.value}:
                      </span>
                      <span className={"text-sm font-bold"}>
                        {formatPercentage(entry.payload.percent * 100)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
        />
        <Tooltip content={<CustomPercentageTooltip />} />
        <Pie
          dataKey={"value"}
          data={data}
          cx={"50%"}
          cy={"50%"}
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          labelLine={false}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
