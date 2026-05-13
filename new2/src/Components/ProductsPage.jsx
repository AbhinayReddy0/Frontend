import { useState, useMemo } from "react";
import {
  Box, Typography, Chip, IconButton, Button, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Divider, Dialog, DialogContent, RadioGroup, FormControlLabel, Radio,
} from "@mui/material";
import {
  Add, Close, Search, KeyboardArrowDown,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0a0a0a", paper: "#111111" },
    primary: { main: "#4ade80" },
    text: { primary: "#f0f0f0", secondary: "#888" },
  },
  typography: { fontFamily: "'DM Mono', 'Courier New', monospace", fontSize: 14 },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "#0d0d0d", border: "1px solid #1e1e1e",
          borderRadius: 12, maxWidth: 860, width: "100%",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "1px solid #1a1a1a", padding: "11px 16px", fontSize: 13 },
        head: { color: "#555", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 13, minWidth: "auto", padding: "6px 14px",
          textTransform: "none", color: "#555",
          "&.Mui-selected": { color: "#f0f0f0" },
          minHeight: 36,
        },
      },
    },
  },
});

// ─── Seed-based deterministic "random" for sparklines ─────────────────────────
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function genSparkline(seed, length = 22, trend = "up", volatility = 0.3) {
  const rand = seededRand(seed);
  const pts = [];
  let val = 30 + rand() * 20;
  for (let i = 0; i < length; i++) {
    const drift = trend === "up" ? 0.8 : trend === "down" ? -0.6 : 0.1;
    val = Math.max(5, val + drift + (rand() - 0.5) * volatility * 20);
    pts.push(val);
  }
  return pts;
}

// ─── PRODUCTS DATA ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: "Cotton tee navy L", code: "CT-NAVY-L", cat: "Apparel",
    stock: 38, inTransit: 240, velNum: 6, vel: "6 / day",
    costPrice: 7.00, sellingPrice: 24.99,
    daysOfCover: 6.3, autonomy: "Full auto", accuracy: "9 / 10", pct: 90,
    stockColor: "#4ade80", stockStatus: "ok", trend: "up", sparkSeed: 1001,
    supplier: "Vendor A", leadTime: "14d", reorderPoint: 50, reorderQty: 200,
    lastPO: { id: "PO-2034", units: 240, eta: "Mar 14", status: "Draft", vendor: "Vendor A", cost: "$1,680" },
    decisions: [
      { id: "D-089", date: "Mar 10", action: "Reorder 240u", outcome: "Correct", approved: true, reason: "Stock below reorder point" },
      { id: "D-082", date: "Feb 28", action: "Reorder 180u", outcome: "Correct", approved: true, reason: "Velocity spike detected" },
      { id: "D-075", date: "Feb 14", action: "Reorder 200u", outcome: "Correct", approved: true, reason: "Scheduled replenishment" },
      { id: "D-068", date: "Jan 30", action: "Hold – excess stock", outcome: "Correct", approved: true, reason: "Overstock alert" },
      { id: "D-061", date: "Jan 15", action: "Reorder 160u", outcome: "Overridden", approved: false, reason: "Manual override by team" },
    ],
    forecast: { d7: 42, d14: 80, d30: 174, d60: 310, confidence: 88 },
    forecastTrend: "up",
  },
  {
    id: 2, name: "Cotton tee navy M", code: "CT-NAVY-M", cat: "Apparel",
    stock: 62, inTransit: 0, velNum: 5, vel: "5 / day",
    costPrice: 7.00, sellingPrice: 24.99,
    daysOfCover: 12.4, autonomy: "Full auto", accuracy: "8 / 10", pct: 80,
    stockColor: "#4ade80", stockStatus: "ok", trend: "up", sparkSeed: 2002,
    supplier: "Vendor A", leadTime: "14d", reorderPoint: 45, reorderQty: 180,
    lastPO: { id: "PO-2029", units: 180, eta: "Mar 20", status: "Confirmed", vendor: "Vendor A", cost: "$1,260" },
    decisions: [
      { id: "D-091", date: "Mar 11", action: "Hold – sufficient stock", outcome: "Correct", approved: true, reason: "Above reorder point" },
      { id: "D-085", date: "Mar 01", action: "Reorder 180u", outcome: "Correct", approved: true, reason: "Projected demand spike" },
      { id: "D-078", date: "Feb 18", action: "Hold – transit inbound", outcome: "Correct", approved: true, reason: "PO already in transit" },
      { id: "D-070", date: "Feb 01", action: "Reorder 150u", outcome: "Overridden", approved: false, reason: "Budget freeze period" },
    ],
    forecast: { d7: 35, d14: 66, d30: 144, d60: 260, confidence: 81 },
    forecastTrend: "up",
  },
  {
    id: 3, name: "Hoodie black M", code: "HD-BLK-M", cat: "Apparel",
    stock: 12, inTransit: 100, velNum: 9, vel: "9 / day",
    costPrice: 22.00, sellingPrice: 64.99,
    daysOfCover: 1.3, autonomy: "Supervised", accuracy: "7 / 10", pct: 70,
    stockColor: "#f97316", stockStatus: "low", trend: "down", sparkSeed: 3003,
    supplier: "Vendor B", leadTime: "21d", reorderPoint: 80, reorderQty: 300,
    lastPO: { id: "PO-2041", units: 100, eta: "Mar 18", status: "Shipped", vendor: "Vendor B", cost: "$4,200" },
    decisions: [
      { id: "D-094", date: "Mar 12", action: "Emergency order 100u", outcome: "Pending", approved: null, reason: "Critical stock alert" },
      { id: "D-088", date: "Mar 06", action: "Reorder 300u", outcome: "Correct", approved: true, reason: "Velocity 9/day detected" },
      { id: "D-080", date: "Feb 22", action: "Reorder 250u", outcome: "Incorrect", approved: true, reason: "Underestimated demand" },
      { id: "D-072", date: "Feb 05", action: "Hold – seasonal dip", outcome: "Incorrect", approved: true, reason: "Model error" },
    ],
    forecast: { d7: 63, d14: 120, d30: 252, d60: 480, confidence: 62 },
    forecastTrend: "down",
  },
  {
    id: 4, name: "Beanie cream OS", code: "BN-CRM-OS", cat: "Accessories",
    stock: 140, inTransit: 0, velNum: 2, vel: "2 / day",
    costPrice: 5.50, sellingPrice: 18.99,
    daysOfCover: 70, autonomy: "Full auto", accuracy: "10/10", pct: 100,
    stockColor: "#4ade80", stockStatus: "ok", trend: "flat", sparkSeed: 4004,
    supplier: "Vendor C", leadTime: "10d", reorderPoint: 30, reorderQty: 100,
    lastPO: { id: "PO-1998", units: 100, eta: "Delivered", status: "Delivered", vendor: "Vendor C", cost: "$1,100" },
    decisions: [
      { id: "D-090", date: "Mar 10", action: "Hold – high stock", outcome: "Correct", approved: true, reason: "70d of cover available" },
      { id: "D-083", date: "Feb 28", action: "Hold – high stock", outcome: "Correct", approved: true, reason: "No action needed" },
      { id: "D-076", date: "Feb 15", action: "Reorder 100u", outcome: "Correct", approved: true, reason: "Seasonal demand forecast" },
      { id: "D-069", date: "Jan 30", action: "Hold – excess", outcome: "Correct", approved: true, reason: "Model confident" },
    ],
    forecast: { d7: 14, d14: 28, d30: 60, d60: 115, confidence: 97 },
    forecastTrend: "flat",
  },
  {
    id: 5, name: "Tote canvas natural", code: "TT-NAT-OS", cat: "Accessories",
    stock: 44, inTransit: 60, velNum: 1, vel: "1 / day",
    costPrice: 8.25, sellingPrice: 29.99,
    daysOfCover: 44, autonomy: "Learning", accuracy: "—28d only", pct: null,
    stockColor: "#facc15", stockStatus: "learning", trend: "up", sparkSeed: 5005,
    supplier: "Vendor C", leadTime: "12d", reorderPoint: 20, reorderQty: 80,
    lastPO: { id: "PO-2038", units: 60, eta: "Mar 22", status: "Confirmed", vendor: "Vendor C", cost: "$660" },
    decisions: [
      { id: "D-093", date: "Mar 11", action: "Reorder 60u (suggested)", outcome: "Learning", approved: null, reason: "Insufficient history — reviewing" },
      { id: "D-086", date: "Mar 02", action: "Hold (suggested)", outcome: "Learning", approved: null, reason: "Only 28d data available" },
    ],
    forecast: { d7: 7, d14: 14, d30: 30, d60: 58, confidence: 44 },
    forecastTrend: "up",
  },
  {
    id: 6, name: "Cap dad navy", code: "CP-NAV-OS", cat: "Accessories",
    stock: 90, inTransit: 0, velNum: 3, vel: "3 / day",
    costPrice: 9.00, sellingPrice: 32.99,
    daysOfCover: 30, autonomy: "Manual", accuracy: "N/A", pct: null,
    stockColor: "#4ade80", stockStatus: "ok", trend: "flat", sparkSeed: 6006,
    supplier: "Vendor B", leadTime: "18d", reorderPoint: 40, reorderQty: 120,
    lastPO: { id: "PO-2015", units: 120, eta: "Delivered", status: "Delivered", vendor: "Vendor B", cost: "$1,440" },
    decisions: [],
    forecast: { d7: 21, d14: 42, d30: 88, d60: 172, confidence: null },
    forecastTrend: "flat",
  },
];

// ─── Sparkline SVG ─────────────────────────────────────────────────────────────
function Sparkline({ seed, trend, width = 160, height = 56 }) {
  const pts = useMemo(() => genSparkline(seed, 22, trend), [seed, trend]);
  const min = Math.min(...pts), max = Math.max(...pts);
  const range = max - min || 1;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * width);
  const ys = pts.map(p => height - ((p - min) / range) * (height - 4) - 2);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const fill = d + ` L ${width} ${height} L 0 ${height} Z`;
  const color = trend === "down" ? "#f97316" : "#4ade80";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`sg-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg-${seed})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Mini forecast bar chart ───────────────────────────────────────────────────
function ForecastBars({ forecast, vel }) {
  const periods = [
    { label: "7d", val: forecast.d7 },
    { label: "14d", val: forecast.d14 },
    { label: "30d", val: forecast.d30 },
    { label: "60d", val: forecast.d60 },
  ];
  const maxVal = Math.max(...periods.map(p => p.val));
  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end", mt: 1 }}>
      {periods.map(({ label, val }) => (
        <Box key={label} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: "#4ade80" }}>{val}u</Typography>
          <Box sx={{
            width: "100%", height: Math.max(4, (val / maxVal) * 80),
            bgcolor: "#1a3a24", border: "1px solid #166534", borderRadius: 0.5,
          }} />
          <Typography sx={{ fontSize: 10, color: "#555" }}>{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

// ─── Decision dots ─────────────────────────────────────────────────────────────
function DecisionDots({ decisions }) {
  const recent = decisions.slice(0, 10);
  return (
    <Box sx={{ display: "flex", gap: "3px", mt: 0.5 }}>
      {recent.map((d, i) => (
        <Box key={i} sx={{
          width: 20, height: 6, borderRadius: 0.5,
          bgcolor: d.outcome === "Correct" ? "#4ade80"
            : d.outcome === "Incorrect" ? "#ef4444"
              : d.outcome === "Overridden" ? "#f97316"
                : "#444",
        }} />
      ))}
    </Box>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = {
    Draft: { bg: "#1a1500", border: "#854d0e", color: "#ca8a04" },
    Confirmed: { bg: "#052e16", border: "#166534", color: "#4ade80" },
    Shipped: { bg: "#0c1a3a", border: "#1d4ed8", color: "#60a5fa" },
    Delivered: { bg: "#1a1a1a", border: "#333", color: "#888" },
    Pending: { bg: "#1a1a1a", border: "#555", color: "#aaa" },
  }[status] || { bg: "#1a1a1a", border: "#333", color: "#888" };
  return (
    <Box sx={{
      px: 1, py: "2px", bgcolor: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 0.75, fontSize: 11, color: s.color, display: "inline-block",
    }}>{status}</Box>
  );
}

// ─── Autonomy chip ─────────────────────────────────────────────────────────────
function AutonChip({ label }) {
  const map = {
    "Full auto": { bg: "#052e16", color: "#4ade80", border: "#166534" },
    Supervised: { bg: "#431407", color: "#fb923c", border: "#9a3412" },
  };
  const c = map[label];
  if (!c) return <Typography sx={{ fontSize: 12, color: "#555" }}>{label}</Typography>;
  return (
    <Box component="span" sx={{
      display: "inline-block", px: 1.25, py: "2px", borderRadius: 0.75,
      border: `1px solid ${c.border}`, bgcolor: c.bg,
      color: c.color, fontSize: 12, whiteSpace: "nowrap",
    }}>{label}</Box>
  );
}

// ─── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, accent }) {
  return (
    <Box sx={{
      bgcolor: "#111", border: "1px solid #1e1e1e", borderRadius: 1.5, p: 1.5,
    }}>
      <Typography sx={{ fontSize: 11, color: "#555", mb: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 500, color: accent || "#f0f0f0" }}>{value}</Typography>
      {sub && <Typography sx={{ fontSize: 11, color: "#444", mt: 0.25 }}>{sub}</Typography>}
    </Box>
  );
}

// ─── MODAL TABS ────────────────────────────────────────────────────────────────
function OverviewTab({ p, autonomy, setAutonomy }) {
  const correct = p.decisions.filter(d => d.outcome === "Correct").length;
  const total = p.decisions.length;
  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
        <MetricCard label="On hand" value={`${p.stock}u`} sub={`${p.daysOfCover}d of cover`} />
        <MetricCard label="In transit" value={p.inTransit > 0 ? `${p.inTransit}u` : "—"} sub={p.inTransit > 0 ? p.lastPO.eta : "No active POs"} />
        <MetricCard label="30d velocity" value={p.vel} sub={`~${(p.velNum * 30)}u / month`} />
        <MetricCard label="Reorder point" value={`${p.reorderPoint}u`} sub={`Order qty: ${p.reorderQty}u`} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", mb: 1 }}>DEMAND — LAST 90 DAYS</Typography>
        <Sparkline seed={p.sparkSeed} trend={p.trend} width={480} height={80} />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          <Typography sx={{ fontSize: 11, color: "#444" }}>90d ago</Typography>
          <Typography sx={{ fontSize: 11, color: p.trend === "down" ? "#f97316" : "#4ade80" }}>
            {p.trend === "up" ? "Trend ↑ growing" : p.trend === "down" ? "Trend ↓ declining" : "Trend → stable"}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "#444" }}>Today</Typography>
        </Box>
      </Box>



    </Box>
  );
}

function ForecastTab({ p }) {
  const { forecast } = p;
  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
        <MetricCard label="Confidence" value={forecast.confidence != null ? `${forecast.confidence}%` : "N/A"}
          accent={forecast.confidence >= 80 ? "#4ade80" : forecast.confidence >= 60 ? "#facc15" : "#f97316"} />
        <MetricCard label="Days of cover" value={`${p.daysOfCover}d`}
          sub={p.daysOfCover < 5 ? "⚠ Critical" : p.daysOfCover < 14 ? "Monitor" : "Healthy"} />
      </Box>

      <Box sx={{ bgcolor: "#111", border: "1px solid #1e1e1e", borderRadius: 1.5, p: 2, mb: 3 }}>
        <Typography sx={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", mb: 1 }}>PROJECTED DEMAND</Typography>
        <ForecastBars forecast={forecast} vel={p.velNum} />
      </Box>

      <Box sx={{ bgcolor: "#111", border: "1px solid #1e1e1e", borderRadius: 1.5, p: 2, mb: 3 }}>
        <Typography sx={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", mb: 1.5 }}>STOCK PROJECTION</Typography>
        {[
          { label: "In 7 days", projected: Math.max(0, p.stock - forecast.d7 + p.inTransit), critical: false },
          { label: "In 14 days", projected: Math.max(0, p.stock - forecast.d14 + p.inTransit), critical: false },
          { label: "In 30 days", projected: Math.max(0, p.stock - forecast.d30 + p.inTransit), critical: false },
          { label: "In 60 days", projected: Math.max(0, p.stock - forecast.d60 + p.inTransit), critical: false },
        ].map(row => {
          const stockLeft = p.stock + p.inTransit - row.projected === 0 ? 0 : row.projected;
          const isLow = stockLeft < p.reorderPoint;
          return (
            <Box key={row.label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.75, borderBottom: "1px solid #1a1a1a", "&:last-child": { border: "none" } }}>
              <Typography sx={{ fontSize: 13, color: "#888" }}>{row.label}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: 13, color: isLow ? "#f97316" : "#4ade80" }}>~{stockLeft}u</Typography>
                {isLow && <Typography sx={{ fontSize: 10, color: "#f97316" }}>below reorder</Typography>}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ bgcolor: "#111", border: "1px solid #1e1e1e", borderRadius: 1.5, p: 2 }}>
        <Typography sx={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", mb: 1 }}>DEMAND TREND</Typography>
        <Sparkline seed={p.sparkSeed + 100} trend={p.forecastTrend} width={480} height={60} />
      </Box>
    </Box>
  );
}

function DecisionsTab({ p }) {
  if (p.decisions.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography sx={{ color: "#555", fontSize: 14 }}>No decisions yet</Typography>
        <Typography sx={{ color: "#444", fontSize: 12, mt: 0.5 }}>Aria is in manual mode for this SKU</Typography>
      </Box>
    );
  }
  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5, mb: 3 }}>
        {(() => {
          const correct = p.decisions.filter(d => d.outcome === "Correct").length;
          const incorrect = p.decisions.filter(d => d.outcome === "Incorrect").length;
          const overridden = p.decisions.filter(d => d.outcome === "Overridden").length;
          return (
            <>
              <MetricCard label="Correct" value={correct} accent="#4ade80" />
              <MetricCard label="Overridden" value={overridden} accent="#f97316" />
              <MetricCard label="Incorrect" value={incorrect} accent="#ef4444" />
            </>
          );
        })()}
      </Box>
      {p.decisions.map(d => (
        <Box key={d.id} sx={{
          bgcolor: "#111", border: "1px solid #1e1e1e", borderRadius: 1.5, p: 1.5, mb: 1,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Typography sx={{ fontSize: 11, color: "#444" }}>{d.id}</Typography>
              <Typography sx={{ fontSize: 11, color: "#555" }}>·</Typography>
              <Typography sx={{ fontSize: 11, color: "#555" }}>{d.date}</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: "#e0e0e0" }}>{d.action}</Typography>
            <Typography sx={{ fontSize: 11, color: "#555", mt: 0.25 }}>{d.reason}</Typography>
          </Box>
          <Box sx={{
            px: 1, py: "2px", borderRadius: 0.75, fontSize: 11, ml: 2, whiteSpace: "nowrap",
            ...(d.outcome === "Correct" ? { bgcolor: "#052e16", color: "#4ade80", border: "1px solid #166534" }
              : d.outcome === "Incorrect" ? { bgcolor: "#450a0a", color: "#f87171", border: "1px solid #7f1d1d" }
                : d.outcome === "Overridden" ? { bgcolor: "#431407", color: "#fb923c", border: "1px solid #9a3412" }
                  : { bgcolor: "#1a1a1a", color: "#888", border: "1px solid #333" }),
          }}>{d.outcome}</Box>
        </Box>
      ))}
    </Box>
  );
}

function POsTab({ p }) {
  const allPOs = [p.lastPO, ...(p.id % 2 === 0 ? [{
    id: `PO-${parseInt(p.lastPO.id.split("-")[1]) - 20}`,
    units: Math.round(p.reorderQty * 0.8),
    eta: "Delivered",
    status: "Delivered",
    vendor: p.supplier,
    cost: `$${Math.round(p.reorderQty * 0.8 * 7)}`,
  }] : [])];
  return (
    <Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 3 }}>
        <MetricCard label="Supplier" value={p.supplier} />
        <MetricCard label="Lead time" value={p.leadTime} />
        <MetricCard label="Reorder qty" value={`${p.reorderQty}u`} />
        <MetricCard label="Reorder point" value={`${p.reorderPoint}u`} />
      </Box>
      <Typography sx={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", mb: 1.5 }}>PURCHASE ORDERS</Typography>
      {allPOs.map(po => (
        <Box key={po.id} sx={{
          bgcolor: "#111", border: "1px solid #1e1e1e", borderRadius: 1.5, p: 2, mb: 1.5,
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: 14, color: "#f0f0f0" }}>{po.id}</Typography>
                <StatusBadge status={po.status} />
              </Box>
              <Typography sx={{ fontSize: 12, color: "#555", mt: 0.25 }}>{po.vendor}</Typography>
            </Box>
            <Typography sx={{ fontSize: 16, color: "#e0e0e0", fontWeight: 500 }}>{po.cost}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box>
              <Typography sx={{ fontSize: 11, color: "#444" }}>Units</Typography>
              <Typography sx={{ fontSize: 13, color: "#e0e0e0" }}>{po.units}u</Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 11, color: "#444" }}>ETA</Typography>
              <Typography sx={{ fontSize: 13, color: "#e0e0e0" }}>{po.eta}</Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// ─── PRODUCT MODAL ─────────────────────────────────────────────────────────────
function ProductModal({ product, onClose }) {
  const [tab, setTab] = useState(0);
  const [autonomy, setAutonomy] = useState(product.autonomy);
  if (!product) return null;
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { maxHeight: "85vh" } }}>
      <Box sx={{ px: 3, pt: 2.5, pb: 0, bgcolor: "#0d0d0d" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", mb: 0.5 }}>PRODUCT DETAIL</Typography>
            <Typography sx={{ fontSize: 22, fontWeight: 500, color: "#f0f0f0", lineHeight: 1.2 }}>
              {product.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
              <Typography sx={{ fontSize: 12, color: "#555" }}>{product.code} · {product.cat}</Typography>
              <AutonChip label={autonomy} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
            <IconButton size="small" onClick={onClose} sx={{ color: "#444" }}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
            <Box sx={{
              px: 1.5, py: "3px", borderRadius: 0.75, fontSize: 11,
              bgcolor: product.stockStatus === "low" ? "#431407" : product.stockStatus === "learning" ? "#1a1500" : "#052e16",
              color: product.stockStatus === "low" ? "#fb923c" : product.stockStatus === "learning" ? "#ca8a04" : "#4ade80",
              border: `1px solid ${product.stockStatus === "low" ? "#9a3412" : product.stockStatus === "learning" ? "#854d0e" : "#166534"}`,
            }}>
              {product.stock}u on hand
            </Box>
          </Box>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)}
          TabIndicatorProps={{ style: { backgroundColor: "#4ade80", height: 1 } }}
          sx={{ "& .MuiTabs-root": { minHeight: 36 } }}>
          {["Overview", "Forecast", "Decisions", "POs"].map(t => (
            <Tab key={t} label={t} />
          ))}
        </Tabs>
      </Box>
      <Divider sx={{ borderColor: "#1a1a1a" }} />
      <DialogContent sx={{ bgcolor: "#0d0d0d", p: 2.5, overflowY: "auto" }}>
        {tab === 0 && <OverviewTab p={product} autonomy={autonomy} setAutonomy={setAutonomy} />}
        {tab === 1 && <ForecastTab p={product} />}
        {tab === 2 && <DecisionsTab p={product} />}
        {tab === 3 && <POsTab p={product} />}
      </DialogContent>
    </Dialog>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterAuto, setFilterAuto] = useState("All");

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.cat)))];
  const autoLevels = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.autonomy)))];

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      || p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || p.cat === filterCat;
    const matchAuto = filterAuto === "All" || p.autonomy === filterAuto;
    return matchSearch && matchCat && matchAuto;
  });

  const totalSKUs = PRODUCTS.length;
  const ariaHandling = PRODUCTS.filter(p => p.autonomy === "Full auto" || p.autonomy === "Supervised").length;
  const paused = PRODUCTS.filter(p => p.autonomy === "Manual").length;
  const lowStock = PRODUCTS.filter(p => p.stockStatus === "low").length;

  return (
    <ThemeProvider theme={theme}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <Box sx={{
        bgcolor: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column",
        fontFamily: "'DM Mono', monospace",
      }}>
        {/* Header */}
        <Box sx={{ px: 3, pt: 3, pb: 1.5, borderBottom: "1px solid #1a1a1a" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography sx={{ fontSize: 20, fontWeight: 500, color: "#f0f0f0" }}>Products</Typography>
              <Typography sx={{ fontSize: 11, color: "#555", mt: 0.25 }}>
                {totalSKUs} SKUs · Aria handling {ariaHandling} · {paused} paused
                {lowStock > 0 && <Box component="span" sx={{ color: "#f97316", ml: 1 }}>· {lowStock} low stock</Box>}
              </Typography>
            </Box>
            <Button variant="outlined" size="small" startIcon={<Add sx={{ fontSize: 13 }} />}
              sx={{
                fontSize: 11, borderColor: "#2a2a2a", color: "#888", borderRadius: 1.5,
                textTransform: "none", py: 0.5,
                "&:hover": { borderColor: "#444", color: "#f0f0f0", bgcolor: "#1a1a1a" },
              }}>
              Add product
            </Button>
          </Box>

          {/* Summary stat cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, mb: 2 }}>
            {[
              { label: "Total SKUs", value: totalSKUs },
              { label: "Full auto", value: PRODUCTS.filter(p => p.autonomy === "Full auto").length, accent: "#4ade80" },
              { label: "Low stock", value: lowStock, accent: lowStock > 0 ? "#f97316" : "#555" },
              { label: "Avg accuracy", value: `${Math.round(PRODUCTS.filter(p => p.pct).reduce((s, p) => s + p.pct, 0) / PRODUCTS.filter(p => p.pct).length)}%`, accent: "#4ade80" },
            ].map(c => (
              <Box key={c.label} sx={{
                bgcolor: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 1.5, p: 1.5,
              }}>
                <Typography sx={{ fontSize: 10, color: "#444", mb: 0.25 }}>{c.label}</Typography>
                <Typography sx={{ fontSize: 18, fontWeight: 500, color: c.accent || "#f0f0f0" }}>{c.value}</Typography>
              </Box>
            ))}
          </Box>

          {/* Filters */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1,
              border: "1px solid #1e1e1e", borderRadius: 1.5, px: 1.5, py: 0.75,
              flex: 1, maxWidth: 280, bgcolor: "#0d0d0d",
            }}>
              <Search sx={{ fontSize: 13, color: "#444" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or code"
                style={{
                  background: "none", border: "none", outline: "none",
                  color: "#f0f0f0", fontSize: 12, fontFamily: "'DM Mono', monospace", width: "100%",
                }} />
            </Box>
            <Box component="select"
              value={filterCat} onChange={e => setFilterCat(e.target.value)}
              sx={{
                bgcolor: "#0d0d0d", border: "1px solid #1e1e1e", color: "#888",
                fontSize: 11, borderRadius: 1, px: 1, py: 0.75, fontFamily: "'DM Mono', monospace",
                cursor: "pointer", appearance: "none",
              }}>
              {categories.map(c => <option key={c} value={c}>{c === "All" ? "Category" : c}</option>)}
            </Box>
            <Box component="select"
              value={filterAuto} onChange={e => setFilterAuto(e.target.value)}
              sx={{
                bgcolor: "#0d0d0d", border: "1px solid #1e1e1e", color: "#888",
                fontSize: 11, borderRadius: 1, px: 1, py: 0.75, fontFamily: "'DM Mono', monospace",
                cursor: "pointer", appearance: "none",
              }}>
              {autoLevels.map(a => <option key={a} value={a}>{a === "All" ? "Autonomy" : a}</option>)}
            </Box>
          </Box>
        </Box>

{/* Table */}
<Box sx={{ flex: 1, overflow: "auto" }}>
  <Table stickyHeader size="small">
    <TableHead>
      <TableRow sx={{ "& th": { bgcolor: "#0a0a0a" } }}>
        <TableCell sx={{ width: "28%" }}>PRODUCT</TableCell>
        <TableCell>STOCK</TableCell>
        <TableCell>IN TRANSIT</TableCell>
        <TableCell>30D VEL</TableCell>
        <TableCell>COST</TableCell>
        <TableCell>SELL</TableCell>
        <TableCell>MARGIN</TableCell>
        <TableCell>TREND</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filtered.map(p => {
        const margin = (((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100).toFixed(0);
        return (
          <TableRow key={p.id} onClick={() => setSelected(p)}
            sx={{
              cursor: "pointer",
              "&:hover": { bgcolor: "#0f0f0f" },
              "& td": { borderColor: "#141414" },
            }}>

            {/* Product */}
            <TableCell>
              <Typography sx={{ fontSize: 12, color: "#e0e0e0" }}>{p.name}</Typography>
              <Typography sx={{ fontSize: 10, color: "#444", mt: 0.25 }}>{p.code} · {p.cat}</Typography>
            </TableCell>

            {/* Stock */}
            <TableCell>
              <Typography sx={{ fontSize: 12, color: p.stockStatus === "low" ? "#f97316" : "#e0e0e0" }}>
                {p.stock}u
              </Typography>
              <Box sx={{ width: 28, height: 2.5, borderRadius: 0.5, bgcolor: p.stockColor, mt: 0.5, opacity: 0.8 }} />
            </TableCell>

            {/* In Transit */}
            <TableCell>
              <Typography sx={{ fontSize: 12, color: p.inTransit > 0 ? "#60a5fa" : "#333" }}>
                {p.inTransit > 0 ? `${p.inTransit}u` : "—"}
              </Typography>
              {p.inTransit > 0 && (
                <Typography sx={{ fontSize: 10, color: "#444", mt: 0.25 }}>{p.lastPO.eta}</Typography>
              )}
            </TableCell>

            {/* 30D Velocity */}
            <TableCell sx={{ fontSize: 12, color: "#e0e0e0" }}>{p.vel}</TableCell>

            {/* Cost Price */}
            <TableCell sx={{ fontSize: 12, color: "#888" }}>${p.costPrice.toFixed(2)}</TableCell>

            {/* Selling Price */}
            <TableCell sx={{ fontSize: 12, color: "#e0e0e0" }}>${p.sellingPrice.toFixed(2)}</TableCell>

            {/* Margin */}
            <TableCell>
              <Typography sx={{
                fontSize: 12,
                color: margin >= 70 ? "#4ade80" : margin >= 50 ? "#facc15" : "#f97316",
              }}>
                {margin}%
              </Typography>
            </TableCell>

            {/* Trend sparkline */}
            <TableCell>
              <Sparkline seed={p.sparkSeed} trend={p.trend} width={80} height={28} />
            </TableCell>

          </TableRow>
        );
      })}
    </TableBody>
  </Table>

  {/* Pagination */}
  <Box sx={{ px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Typography sx={{ fontSize: 11, color: "#444" }}>
      Showing {filtered.length} of {totalSKUs}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {["‹", 1, 2, 3, "›"].map((n, i) => (
        <Box key={i} sx={{
          width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 0.75, fontSize: 11, cursor: "pointer",
          bgcolor: n === 1 ? "#1e1e1e" : "transparent",
          color: n === 1 ? "#f0f0f0" : "#444",
          "&:hover": { bgcolor: "#1a1a1a", color: "#888" },
        }}>{n}</Box>
      ))}
    </Box>
  </Box>
</Box>

        {/* Modal */}
        {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
      </Box>
    </ThemeProvider>
  );
}