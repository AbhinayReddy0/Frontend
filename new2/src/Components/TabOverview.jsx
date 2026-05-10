import { Box, Grid, Typography } from "@mui/material";
import { MiniLineChart } from "./Charts";

const SectionTitle = ({ children }) => (
  <Typography sx={{ fontSize: 10, color: "#555", letterSpacing: "1px", px: 2, pt: 1.5, pb: 0.5 }}>
    {children}
  </Typography>
);

const StatCell = ({ label, value, valueColor, sub, subColor }) => (
  <Box sx={{ background: "#050505", p: "14px 16px" }}>
    <Typography sx={{ fontSize: 10, color: "#555", letterSpacing: "0.5px", mb: 0.5 }}>{label}</Typography>
    <Typography sx={{ fontSize: 18, fontWeight: 700, color: valueColor || "#fff" }}>{value}</Typography>
    {sub && (
      <Typography sx={{ fontSize: 10, color: subColor || "#555", mt: 0.3 }}>{sub}</Typography>
    )}
  </Box>
);

export default function TabOverview({ v }) {
  const trendColor = v.id === "VB" ? "#ef4444" : v.id === "VA" ? "#22c55e" : "#888";
  const trendLabel = v.id === "VB" ? "↓ declining" : v.id === "VA" ? "↑ 2% vs 90d" : "→ steady";

  return (
    <Box>
      {/* Stat grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#111" }}>
        <StatCell label="ON-TIME DELIVERY"  value={`${v.onTime}%`}    valueColor={v.accentColor} sub={trendLabel}    subColor={trendColor} />
        <StatCell label="ORDER ACCURACY"    value={`${v.accuracy}%`}  valueColor={v.accentColor} sub="→ steady"      subColor="#888" />
        <StatCell label="AVG LEAD TIME"     value={v.avgLead}          valueColor={v.accentColor} sub={`vs ${v.leadPromised} promised`} />
        <StatCell label="OPEN POs"          value={v.openPOs}          valueColor={v.accentColor} sub={`${v.openVal} in flight`} />
      </Box>

      {/* Delivery chart */}
      <SectionTitle>PROMISED vs ACTUAL — LAST 90d</SectionTitle>
      <Box sx={{ px: 2, pb: 1 }}>
        <MiniLineChart data={v.delivery} color={v.accentColor} height={140} />
      </Box>

      {/* Dot timeline */}
      <Typography sx={{ fontSize: 10, color: "#555", px: 2, pb: 0.5 }}>
        {v.deliveryStats.deliveries} deliveries · {v.deliveryStats.onTime} on time · {v.deliveryStats.late} late &nbsp; Trend {v.deliveryStats.trend}
      </Typography>
      <Box sx={{ display: "flex", gap: "3px", px: 2, pb: 1.5, flexWrap: "wrap" }}>
        {v.dots.map((d, i) => (
          <Box key={i} sx={{ width: 10, height: 10, borderRadius: "50%", background: d ? v.accentColor : "#ef4444", flexShrink: 0 }} />
        ))}
      </Box>

      {/* Aria Assessment */}
      <SectionTitle>ARIA'S ASSESSMENT</SectionTitle>
      <Box sx={{
        mx: 1.5, mb: 1.5, borderRadius: 2, p: 1.5,
        background: v.id === "VB" ? "#1a0700" : v.id === "VA" ? "#0a1f0e" : "#0d0d1a",
        border: `1px solid ${v.accentColor}33`,
      }}>
        <Box sx={{
          display: "inline-flex", alignItems: "center", borderRadius: "5px",
          px: 1, py: 0.3, fontSize: 10, fontWeight: 700, mb: 1,
          ...v.rankStyle,
        }}>
          {v.rankLabel}
        </Box>
        <Typography sx={{
          fontSize: 11, lineHeight: 1.7,
          color: v.id === "VB" ? "#fdba74" : v.id === "VA" ? "#86efac" : "#a5b4fc",
        }}>
          {v.ariaReason}
        </Typography>
      </Box>

      {/* Recent comms preview */}
      <SectionTitle>RECENT COMMUNICATION</SectionTitle>
      {v.comms.slice(0, 2).map((c, i) => (
        <Box key={i} sx={{ px: 2, py: 1.2, borderBottom: "1px solid #0d0d0d" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
            <Typography sx={{ fontSize: 10, color: c.from.startsWith("Aria") ? "#22c55e" : v.accentColor }}>
              {c.from}
            </Typography>
            <Typography sx={{ fontSize: 10, color: "#444" }}>{c.time}</Typography>
          </Box>
          <Typography sx={{ fontSize: 11, color: "#aaa", lineHeight: 1.6 }}>"{c.text}"</Typography>
        </Box>
      ))}
    </Box>
  );
}
