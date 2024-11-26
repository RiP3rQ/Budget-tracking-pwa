import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export const RadarChartVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={384}>
      <RadarChart cx={"50%"} cy={"50%"} outerRadius={"60%"} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" style={{ fontSize: "0.75rem" }} />
        <PolarRadiusAxis style={{ fontSize: "0.75rem" }} />
        <Radar
          dataKey="value"
          fill="#3b82f6"
          stroke="#3b82f6"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
