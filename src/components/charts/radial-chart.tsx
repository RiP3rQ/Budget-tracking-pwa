import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/currencies";

const COLORS = ["#3d82f6", "#f43f5e", "#12c6ff", "#ff9354"];

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export const RadialChartVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={384}>
      <RadialBarChart
        cx={"50%"}
        cy={"30%"}
        barSize={10}
        innerRadius={"90%"}
        outerRadius={"40%"}
        data={data?.map((entry, index) => ({
          ...entry,
          fill: COLORS[index % COLORS.length],
        }))}
      >
        <RadialBar
          dataKey={"value"}
          background
          label={{ position: "insideStart", fill: "#fff", fontSize: "12px" }}
        />
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
                        {formatCurrency(entry.payload.value)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};
