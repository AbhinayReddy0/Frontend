import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/* ─── Theme tokens ──────────────────────────────────────────── */
const T = {
  bg: "#000000", paper: "#0a0a0a", paperHov: "#0d1f13",
  border: "#1a1a1a", borderFaint: "#111111",
  green: "#22c55e", greenDark: "#071a0e", greenBorder: "#14532d",
  textPrimary: "#ffffff", textSecondary: "#8a8a8a",
  textMuted: "#555555", textDim: "#444444",
  amber: "#f59e0b", amberDark: "#431407",
  red: "#ef4444", redDark: "#450a0a",
  blue: "#3b82f6",
};

/* ─── SKU data ──────────────────────────────────────────────── */
const SKUS = [
  {
    id: "CT-NAVY-L", name: "Cotton tee navy L",
    stock: 38, baseForecast: 372, rangeMin: 340, rangeMax: 410,
    confidence: 94, trendLabel: "↑ 2.3x", category: "Tees", stockoutRisk: true, price: 29.99,
    drivers: [
      { name: "Cyber Monday promo (10d out)", desc: "Based on last year's 2.3x lift on this SKU", base: 148 },
      { name: "Weekly seasonality", desc: "Saturday spikes 2.3x weekday average", base: 22 },
      { name: "30d trend (↑ growing)", desc: "Velocity increased from 4/day to 6/day", base: 45 },
      { name: "Baseline demand", desc: "90-day moving average", base: 157 },
    ],
    accuracy: [
      { label: "Feb 12 forecast (60d)", value: 94 },
      { label: "Jan 28 forecast (60d)", value: 91 },
      { label: "Jan 14 forecast (60d)", value: 88 },
      { label: "Dec 30 forecast (60d)", value: 95 },
      { label: "Dec 16 forecast (60d)", value: 82 },
    ],
  },
  {
    id: "HD-BLK-M", name: "Hoodie black M",
    stock: 12, baseForecast: 540, rangeMin: 490, rangeMax: 600,
    confidence: 88, trendLabel: "↑ 3.2x", category: "Hoodies", stockoutRisk: true, price: 59.99,
    drivers: [
      { name: "Seasonal demand spike", desc: "Winter season drives 3× normal demand", base: 210 },
      { name: "New color launch", desc: "Black colorway trending +45% vs prior season", base: 98 },
      { name: "30d trend (↑ growing)", desc: "Velocity increased from 6/day to 9/day", base: 87 },
      { name: "Baseline demand", desc: "90-day moving average", base: 145 },
    ],
    accuracy: [
      { label: "Feb 12 forecast (60d)", value: 89 },
      { label: "Jan 28 forecast (60d)", value: 85 },
      { label: "Jan 14 forecast (60d)", value: 91 },
      { label: "Dec 30 forecast (60d)", value: 88 },
      { label: "Dec 16 forecast (60d)", value: 84 },
    ],
  },
  {
    id: "CT-NAVY-M", name: "Cotton tee navy M",
    stock: 62, baseForecast: 298, rangeMin: 270, rangeMax: 325,
    confidence: 91, trendLabel: "→ steady", category: "Tees", stockoutRisk: false, price: 29.99,
    drivers: [
      { name: "Seasonal baseline", desc: "Spring/summer demand stable at current levels", base: 180 },
      { name: "Size distribution", desc: "M size accounts for 35% of navy tee demand", base: 75 },
      { name: "30d trend (steady)", desc: "Velocity stable at 5/day", base: 10 },
      { name: "Baseline demand", desc: "90-day moving average", base: 113 },
    ],
    accuracy: [
      { label: "Feb 12 forecast (60d)", value: 93 },
      { label: "Jan 28 forecast (60d)", value: 90 },
      { label: "Jan 14 forecast (60d)", value: 89 },
      { label: "Dec 30 forecast (60d)", value: 94 },
      { label: "Dec 16 forecast (60d)", value: 88 },
    ],
  },
  {
    id: "BN-CRM-OS", name: "Beanie cream OS",
    stock: 140, baseForecast: 120, rangeMin: 90, rangeMax: 180,
    confidence: 68, trendLabel: "↑ 1.4x", category: "Accessories", stockoutRisk: false, price: 24.99,
    drivers: [
      { name: "Holiday gifting season", desc: "Accessories spike 40% in Q4", base: 42 },
      { name: "Influencer campaign", desc: "Social posts driving category awareness", base: 28 },
      { name: "30d trend (↑ slight)", desc: "Velocity increased from 1.5/day to 2/day", base: 18 },
      { name: "Baseline demand", desc: "90-day moving average", base: 32 },
    ],
    accuracy: [
      { label: "Feb 12 forecast (60d)", value: 71 },
      { label: "Jan 28 forecast (60d)", value: 65 },
      { label: "Jan 14 forecast (60d)", value: 69 },
      { label: "Dec 30 forecast (60d)", value: 73 },
      { label: "Dec 16 forecast (60d)", value: 62 },
    ],
  },
  {
    id: "TT-NAT-OS", name: "Tote canvas natural",
    stock: 44, baseForecast: 68, rangeMin: 35, rangeMax: 110,
    confidence: 52, trendLabel: "↑ new", category: "Accessories", stockoutRisk: false, price: 34.99,
    drivers: [
      { name: "New product launch", desc: "Limited sales history (45 days)", base: 20 },
      { name: "Category trend", desc: "Canvas totes growing 22% YoY", base: 18 },
      { name: "Paid social", desc: "Marketing spend driving initial discovery", base: 15 },
      { name: "Baseline (estimated)", desc: "Estimated from similar SKU launches", base: 15 },
    ],
    accuracy: [
      { label: "Feb 12 forecast (60d)", value: 54 },
      { label: "Jan 28 forecast (60d)", value: 48 },
      { label: "Jan 14 forecast (60d)", value: 52 },
      { label: "Dec 30 forecast (60d)", value: null },
      { label: "Dec 16 forecast (60d)", value: null },
    ],
  },
];

const HORIZONS = ["30d", "60d", "90d", "180d"];
const H_MULT  = { "30d": 0.5, "60d": 1.0, "90d": 1.5, "180d": 3.0 };
const CATS    = ["All", "Tees", "Hoodies", "Accessories"];

/* ─── Helpers ────────────────────────────────────────────────── */
const cColor = c => c >= 85 ? T.green : c >= 65 ? T.amber : T.red;
const cBg    = c => c >= 85 ? T.greenDark : c >= 65 ? T.amberDark : T.redDark;
const fmtRev = v => v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${Math.round(v / 1000)}K`;

function makeChart(baseFc) {
  const base = baseFc * 0.5;
  const pts = [];
  for (let i = 9; i >= 0; i--) {
    const t = (9 - i) / 9;
    const v = base + (baseFc * 0.85 - base) * t;
    const seed = ((baseFc * 7 + i * 37) % 41) - 20;
    pts.push({ x: i === 0 ? "Today" : `-${i * 10}d`, actual: Math.round(v + seed * 0.07 * v), pastFc: Math.round(v * 0.95) });
  }
  for (let i = 1; i <= 6; i++) {
    const fv = baseFc * (1 + (i / 6) * 0.15);
    pts.push({ x: `+${i * 10}d`, futureFc: Math.round(fv), cHigh: Math.round(fv * 1.11), cLow: Math.round(fv * 0.89) });
  }
  return pts;
}

const ttStyle = { background: "#111", border: "1px solid #222", borderRadius: 8, fontSize: 11, color: "#ccc" };

/* ─── Forecast tab ───────────────────────────────────────────── */
function ForecastTab({ sku, horizon, mult }) {
  const fc   = Math.round(sku.baseForecast * mult);
  const rMin = Math.round(sku.rangeMin * mult);
  const rMax = Math.round(sku.rangeMax * mult);
  const cd   = useMemo(() => makeChart(sku.baseForecast), [sku.id]);

  return (
    <div>
      <div style={{ background: T.greenDark, border: `1px solid ${T.greenBorder}`, borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: T.green, letterSpacing: "1px", fontWeight: 700, marginBottom: 4 }}>
          PREDICTED DEMAND · NEXT {horizon}
        </div>
        <div style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.1 }}>
          {fc.toLocaleString()} <span style={{ fontSize: 18, color: T.textSecondary }}>units</span>
        </div>
        <div style={{ fontSize: 12, color: T.green, marginTop: 6 }}>
          range {rMin}–{rMax}u · {sku.confidence}% confidence
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "1px", fontWeight: 700, marginBottom: 12 }}>
          FORECAST vs ACTUAL · LAST 90d + NEXT {horizon}
        </div>
        <ResponsiveContainer width="100%" height={165}>
          <AreaChart data={cd} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#111" />
            <XAxis dataKey="x" tick={{ fill: "#3a3a3a", fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fill: "#3a3a3a", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={ttStyle} labelStyle={{ color: "#888" }} />
            <Area type="monotone" dataKey="cHigh" fill="#0a2a15" stroke="none" fillOpacity={1} />
            <Area type="monotone" dataKey="cLow"  fill="#070707" stroke="none" fillOpacity={1} />
            <Line type="monotone" dataKey="actual"   stroke="#ffffff" strokeWidth={2}   dot={false} connectNulls />
            <Line type="monotone" dataKey="pastFc"   stroke={T.blue}  strokeWidth={1.5} dot={false} strokeDasharray="4 4" connectNulls />
            <Line type="monotone" dataKey="futureFc" stroke={T.green} strokeWidth={2}   dot={false} connectNulls />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 10, color: "#555", flexWrap: "wrap" }}>
          {[["#fff","Actual"],["#3b82f6","Past forecast"],["#22c55e","Future forecast"],["#0a2a15","Confidence band"]].map(([c, l]) => (
            <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 14, height: 3, background: c, display: "inline-block", borderRadius: 2 }} />
              {l}
            </span>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "1px", fontWeight: 700, marginBottom: 12 }}>
        WHAT'S DRIVING THIS FORECAST
      </div>
      {sku.drivers.map((d, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 0", borderBottom: `1px solid ${T.borderFaint}` }}>
          <div>
            <div style={{ fontSize: 13, color: "#ddd" }}>{d.name}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{d.desc}</div>
          </div>
          <span style={{ color: T.green, fontWeight: 700, fontSize: 13, minWidth: 52, textAlign: "right" }}>
            +{Math.round(d.base * mult)}u
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Drivers tab ────────────────────────────────────────────── */
function DriversTab({ sku, mult }) {
  const total = sku.drivers.reduce((s, d) => s + d.base, 0);
  const greens = ["#22c55e", "#4ade80", "#86efac", "#bbf7d0"];
  return (
    <div>
      <p style={{ color: T.textSecondary, fontSize: 13, margin: "0 0 20px" }}>
        All signals influencing this forecast with their relative contribution to predicted demand.
      </p>
      {sku.drivers.map((d, i) => {
        const pct = Math.round((d.base / total) * 100);
        return (
          <div key={i} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>{d.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{d.desc}</div>
              </div>
              <div style={{ textAlign: "right", minWidth: 72 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.green }}>+{Math.round(d.base * mult)}u</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{pct}% of total</div>
              </div>
            </div>
            <div style={{ height: 5, background: "#111", borderRadius: 3 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: greens[i] || T.green, borderRadius: 3, opacity: 0.75 }} />
            </div>
          </div>
        );
      })}
      <div style={{ marginTop: 16, background: T.paper, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px" }}>
        <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 700, letterSpacing: "1px", marginBottom: 12 }}>SIGNAL QUALITY</div>
        <div style={{ display: "flex", gap: 28 }}>
          {[
            ["DATA COMPLETENESS", sku.confidence >= 80 ? "High" : "Medium", sku.confidence >= 80 ? T.green : T.amber],
            ["HISTORY DEPTH", sku.confidence >= 85 ? "90d+" : sku.confidence >= 70 ? "60d" : "45d", "#ddd"],
            ["DRIVER SIGNALS", String(sku.drivers.length), "#ddd"],
          ].map(([label, val, c]) => (
            <div key={label}>
              <div style={{ fontSize: 9, color: T.textMuted, fontWeight: 700, letterSpacing: "1px" }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: c, marginTop: 4 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Accuracy tab ───────────────────────────────────────────── */
function AccuracyTab({ sku }) {
  const nums    = sku.accuracy.filter(a => a.value !== null);
  const avg     = nums.length ? Math.round(nums.reduce((s, a) => s + a.value, 0) / nums.length) : 0;
  const trendPts = [...nums].reverse().map(a => ({ l: a.label.split(" ").slice(0, 2).join(" "), v: a.value }));
  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, background: T.greenDark, border: `1px solid ${T.greenBorder}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: T.green, letterSpacing: "1px", fontWeight: 700 }}>AVG ACCURACY</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: T.green }}>{avg}%</div>
          <div style={{ fontSize: 11, color: T.green, opacity: 0.7 }}>last {nums.length} forecasts</div>
        </div>
        <div style={{ flex: 1, background: T.paper, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: "1px", fontWeight: 700 }}>CONFIDENCE SCORE</div>
          <div style={{ fontSize: 36, fontWeight: 700 }}>{sku.confidence}%</div>
          <div style={{ fontSize: 11, color: T.textSecondary }}>active forecast</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "1px", fontWeight: 700, marginBottom: 12 }}>
        PAST FORECAST ACCURACY
      </div>
      <div style={{ background: T.paper, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 22 }}>
        {sku.accuracy.map((a, i) => {
          const v  = a.value;
          const c  = v !== null ? cColor(v) : T.textMuted;
          const bg = v !== null ? cBg(v)    : "transparent";
          const st = v === null ? "—" : v >= 85 ? "✓ Accurate" : v >= 70 ? "~ Close" : "✗ Off";
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: i < sku.accuracy.length - 1 ? `1px solid ${T.borderFaint}` : "none" }}>
              <span style={{ fontSize: 13, color: "#ccc" }}>{a.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ background: bg, color: c, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  {v !== null ? `${v}%` : "—"}
                </span>
                <span style={{ fontSize: 11, color: c, minWidth: 70 }}>{st}</span>
              </div>
            </div>
          );
        })}
      </div>

      {trendPts.length >= 2 && (
        <>
          <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "1px", fontWeight: 700, marginBottom: 10 }}>ACCURACY TREND</div>
          <ResponsiveContainer width="100%" height={90}>
            <LineChart data={trendPts} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <XAxis dataKey="l" tick={{ fill: "#3a3a3a", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fill: "#3a3a3a", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={ttStyle} />
              <Line type="monotone" dataKey="v" stroke={T.green} strokeWidth={2} dot={{ fill: T.green, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────── */
export default function ForecastingPage() {
  const [horizon,     setHorizon]     = useState("60d");
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("All");
  const [lowConf,     setLowConf]     = useState(false);
  const [stockoutOnly,setStockoutOnly]= useState(false);
  const [selectedId,  setSelectedId]  = useState(null);
  const [tab,         setTab]         = useState(0);

  const mult = H_MULT[horizon];

  const filtered = useMemo(() => SKUS.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && s.category !== category) return false;
    if (lowConf && s.confidence >= 60) return false;
    if (stockoutOnly && !s.stockoutRisk) return false;
    return true;
  }), [search, category, lowConf, stockoutOnly]);

  const metrics = useMemo(() => {
    const demand   = filtered.reduce((s, x) => s + Math.round(x.baseForecast * mult), 0);
    const revenue  = filtered.reduce((s, x) => s + x.baseForecast * mult * x.price, 0);
    const avgConf  = filtered.length ? Math.round(filtered.reduce((s, x) => s + x.confidence, 0) / filtered.length) : 0;
    const stockouts = filtered.filter(x => x.stockoutRisk).length;
    const lowCnt   = filtered.filter(x => x.confidence < 60).length;
    return { demand, revenue, avgConf, stockouts, lowCnt };
  }, [filtered, mult]);

  const selectedSku = selectedId ? SKUS.find(s => s.id === selectedId) : null;
  const openSku  = id => { setSelectedId(id); setTab(0); };
  const closeSku = ()  => setSelectedId(null);

  /* style helpers */
  const hBtn = active => ({
    background: active ? T.green : "transparent", color: active ? "#000" : T.textSecondary,
    border: "none", borderRadius: 7, padding: "6px 16px",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
  });
  const tabBtn = active => ({
    background: "transparent", border: "none",
    borderBottom: `2px solid ${active ? T.green : "transparent"}`,
    color: active ? T.green : "#666",
    padding: "8px 20px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", marginBottom: -1,
  });
  const card = {
    background: T.paper, border: `1px solid ${T.border}`,
    borderRadius: 12, padding: "16px 20px",
  };

  return (
    <div style={{ position: "relative", background: T.bg, minHeight: 860, color: T.textPrimary, fontFamily: "'Inter', -apple-system, sans-serif", padding: "28px 28px 48px" }}>

      {/* Header */}
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>Forecasting</h1>
        <p style={{ margin: "5px 0 0", color: T.textMuted, fontSize: 13 }}>
          Aria's predicted demand for the next horizon · last forecast 87% accurate
        </p>
      </div>

      {/* Metrics + horizon selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "PREDICTED DEMAND", val: `${metrics.demand.toLocaleString()}u`,  sub: `across ${filtered.length} SKUs · next ${horizon}` },
            { label: "REVENUE FORECAST",  val: fmtRev(metrics.revenue),               sub: `↑ 23% vs prior ${horizon}` },
            { label: "AVG CONFIDENCE",    val: `${metrics.avgConf}%`,                 sub: `${metrics.lowCnt} SKUs below 60%`, warn: metrics.avgConf < 70 },
            { label: "STOCKOUT RISK",     val: `${metrics.stockouts} SKUs`,           sub: `in next ${horizon} at current pace`, danger: true },
          ].map(m => (
            <div key={m.label} style={card}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", color: T.textDim, marginBottom: 5 }}>{m.label}</div>
              <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.1, color: m.danger ? T.red : m.warn ? T.amber : T.textPrimary }}>{m.val}</div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{m.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 3, background: T.paper, border: `1px solid ${T.border}`, borderRadius: 10, padding: 3 }}>
          {HORIZONS.map(h => <button key={h} style={hBtn(horizon === h)} onClick={() => setHorizon(h)}>{h}</button>)}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.textMuted, pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKUs"
            style={{ background: T.paper, border: `1px solid ${T.border}`, borderRadius: 8, color: "#fff", padding: "8px 12px 8px 30px", fontSize: 13, outline: "none", width: 168, fontFamily: "inherit" }} />
        </div>

        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{ background: T.paper, border: `1px solid ${T.border}`, borderRadius: 8, color: category !== "All" ? T.green : "#ccc", padding: "8px 12px", fontSize: 13, outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
          {CATS.map(c => <option key={c} value={c} style={{ background: "#111" }}>{c === "All" ? "Category ▾" : c}</option>)}
        </select>

        <button onClick={() => setLowConf(!lowConf)}
          style={{ background: lowConf ? T.redDark : T.paper, border: `1px solid ${lowConf ? T.red : T.border}`, borderRadius: 20, color: lowConf ? T.red : T.textSecondary, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          Confidence &lt; 60%
          {lowConf && <X size={11} />}
        </button>

        <select value={stockoutOnly ? "risk" : "all"} onChange={e => setStockoutOnly(e.target.value === "risk")}
          style={{ background: T.paper, border: `1px solid ${T.border}`, borderRadius: 8, color: stockoutOnly ? T.red : "#ccc", padding: "8px 12px", fontSize: 13, outline: "none", cursor: "pointer", fontFamily: "inherit" }}>
          <option value="all"  style={{ background: "#111" }}>Stockout risk ▾</option>
          <option value="risk" style={{ background: "#111" }}>At risk only</option>
        </select>
      </div>

      {/* SKU table */}
      <div style={{ background: T.paper, border: `1px solid ${T.borderFaint}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["SKU", "STOCK", `${horizon} FORECAST`, "RANGE", "CONFIDENCE", "TREND"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 9, fontWeight: 700, letterSpacing: "1px", color: T.textDim, borderBottom: `1px solid ${T.borderFaint}`, background: T.bg }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(sku => {
              const fc   = Math.round(sku.baseForecast * mult);
              const rMin = Math.round(sku.rangeMin * mult);
              const rMax = Math.round(sku.rangeMax * mult);
              return (
                <tr key={sku.id}
                  onClick={() => openSku(sku.id)}
                  style={{ cursor: "pointer", borderBottom: `1px solid ${T.borderFaint}` }}
                  onMouseEnter={e => e.currentTarget.style.background = T.paperHov}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{sku.name}</div>
                    <div style={{ fontSize: 10, color: T.textDim, marginTop: 2 }}>{sku.id}</div>
                  </td>
                  <td style={{ padding: "13px 16px", color: T.textSecondary, fontSize: 13 }}>{sku.stock}u</td>
                  <td style={{ padding: "13px 16px", fontWeight: 600, fontSize: 13 }}>{fc}u</td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>{rMin}–{rMax}u</div>
                    <div style={{ position: "relative", height: 4, background: "#1a1a1a", borderRadius: 2, width: 90 }}>
                      <div style={{ position: "absolute", left: "15%", width: "70%", height: "100%", background: "#1a4a6e", borderRadius: 2 }} />
                      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: 2, height: 10, top: -3, background: "#4a9fd4", borderRadius: 1 }} />
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ background: cBg(sku.confidence), color: cColor(sku.confidence), padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                      {sku.confidence}%
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: T.textSecondary }}>{sku.trendLabel}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 44, textAlign: "center", color: T.textMuted, fontSize: 13 }}>No SKUs match current filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Centered modal overlay (absolute, not fixed) ── */}
      {selectedSku && (
        <div
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: 50, padding: "36px 20px 40px" }}
          onClick={closeSku}>
          <div
            style={{ background: "#080808", border: `1px solid ${T.border}`, borderRadius: 18, width: "100%", maxWidth: 660, maxHeight: 760, overflowY: "auto", padding: "26px 28px 32px" }}
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 9, color: T.textDim, letterSpacing: "1px", fontWeight: 700, marginBottom: 5 }}>FORECAST DETAIL</div>
                <h2 style={{ margin: 0, fontSize: 21, fontWeight: 700 }}>{selectedSku.name}</h2>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{selectedSku.id} · {horizon}-day horizon</div>
              </div>
              <button onClick={closeSku}
                style={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#888", padding: "6px 9px", cursor: "pointer", display: "flex", alignItems: "center", lineHeight: 1 }}>
                <X size={14} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: 22 }}>
              {["Forecast", "Drivers", "Accuracy"].map((t, idx) => (
                <button key={t} onClick={() => setTab(idx)} style={tabBtn(tab === idx)}>{t}</button>
              ))}
            </div>

            {tab === 0 && <ForecastTab sku={selectedSku} horizon={horizon} mult={mult} />}
            {tab === 1 && <DriversTab  sku={selectedSku} mult={mult} />}
            {tab === 2 && <AccuracyTab sku={selectedSku} />}
          </div>
        </div>
      )}
    </div>
  );
}