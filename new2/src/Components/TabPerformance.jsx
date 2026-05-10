import { Box, Typography } from "@mui/material";
import { MiniLineChart, MiniBarChart } from "./Charts";

const SectionTitle = ({ children }) => (
  <Typography sx={{ fontSize: 10, color: "#555", letterSpacing: "1px", px: 2, pt: 1.5, pb: 0.5 }}>
    {children}
  </Typography>
);

const StatCell = ({ label, value, valueColor }) => (
  <Box sx={{ background: "#050505", p: "14px 16px" }}>
    <Typography sx={{ fontSize: 10, color: "#555", letterSpacing: "0.5px", mb: 0.5 }}>{label}</Typography>
    <Typography sx={{ fontSize: 18, fontWeight: 700, color: valueColor || "#fff" }}>{value}</Typography>
  </Box>
);

export default function TabPerformance({ v }) {
  const acc2Color = v.id === "VA" ? "#38bdf8" : v.id === "VC" ? "#a78bfa" : "#fb923c";
  const trendColor = v.deliveryStats.trend === "↑" ? "#22c55e" : v.deliveryStats.trend === "↓" ? "#ef4444" : "#888";

  return (
    <Box>
      <SectionTitle>ON-TIME DELIVERY TREND</SectionTitle>
      <Box sx={{ px: 1.5, pb: 1 }}>
        <MiniLineChart data={v.delivery} color={v.accentColor} height={140} />
      </Box>

      <SectionTitle>ORDER ACCURACY TREND</SectionTitle>
      <Box sx={{ px: 1.5, pb: 1 }}>
        <MiniLineChart data={v.accuracy_trend} color={acc2Color} height={140} />
      </Box>

      <SectionTitle>WEEKLY DELIVERY PERFORMANCE</SectionTitle>
      <Box sx={{ px: 1.5, pb: 1 }}>
        <MiniBarChart data={v.weeklyBar} color={v.accentColor} height={130} />
      </Box>

      {/* Summary stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#111", mt: 1 }}>
        <StatCell label="DELIVERIES" value={v.deliveryStats.deliveries} />
        <StatCell label="ON-TIME"    value={v.deliveryStats.onTime}     valueColor={v.accentColor} />
        <StatCell label="LATE"       value={v.deliveryStats.late}       valueColor="#ef4444" />
        <StatCell label="TREND"      value={v.deliveryStats.trend}      valueColor={trendColor} />
      </Box>
    </Box>
  );
}
