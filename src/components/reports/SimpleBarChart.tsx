import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  labels: string[];
  data: number[];
  seriesName?: string;
  height?: number;
}

export function SimpleBarChart({
  labels,
  data,
  seriesName = "Value",
  height = 300,
}: Props) {
  const chartData = labels.map((label, i) => ({ label, value: data[i] ?? 0 }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, bottom: 8, left: -10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#eef2f7"
          vertical={false}
        />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 13,
          }}
          formatter={(value) => [`${Number(value ?? 0)}`, seriesName]}
        />
        <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
