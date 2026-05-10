import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    background: "#111", border: "1px solid #222",
    borderRadius: 6, fontSize: 11, color: "#fff",
    fontFamily: "'Courier New', monospace",
  },
  labelStyle: { color: "#666" },
  cursor: { stroke: "#333" },
};

export function MiniLineChart({ data, color, height = 140 }) {
  const gradId = `grad_${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: -28 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
        <XAxis dataKey="d" tick={{ fill: "#444", fontSize: 9 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "#444", fontSize: 9 }} tickLine={false} axisLine={false} domain={["auto", "auto"]} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone" dataKey="v" stroke={color} strokeWidth={2}
          fill={`url(#${gradId})`} dot={{ fill: color, r: 2.5, strokeWidth: 0 }}
          activeDot={{ r: 4, fill: color }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MiniBarChart({ data, color, height = 130 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 10, bottom: 0, left: -28 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false} />
        <XAxis dataKey="d" tick={{ fill: "#444", fontSize: 9 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "#444", fontSize: 9 }} tickLine={false} axisLine={false} domain={[60, "auto"]} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="v" fill={color} radius={[3, 3, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
