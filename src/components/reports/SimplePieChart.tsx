import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  labels: string[];
  values: number[];
  height?: number;
}

const COLORS = [
  "#3b82f6",
  "#0ea5e9",
  "#16a34a",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
];

export function SimplePieChart({ labels, values, height = 300 }: Props) {
  const data = labels.map((label, i) => ({
    name: label,
    value: values[i] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 13,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
