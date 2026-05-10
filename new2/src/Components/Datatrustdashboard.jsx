import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Divider,
  Stack,
  Paper,
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000000", paper: "#0a0a0a" },
    primary: { main: "#22c55e" },
    text: { primary: "#ffffff", secondary: "#8a8a8a" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.6rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.7 },
    body2: { fontSize: "0.92rem", lineHeight: 1.6 },
    button: { fontSize: "0.9rem", fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#080808",
          backgroundImage: "none",
          border: "1px solid #1a1a1a",
          borderRadius: 18,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.3px",
          textTransform: "none",
          minWidth: 90,
          color: "#777",
          "&.Mui-selected": { color: "#22c55e" },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: "#22c55e", height: 3, borderRadius: 10 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #111",
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          color: "#ddd",
          padding: "16px 18px",
        },
        head: {
          color: "#777",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase",
          backgroundColor: "#000",
          padding: "12px 18px",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#111",
          border: "1px solid #222",
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          padding: "8px 10px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 18px",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: "'Inter', sans-serif", fontSize: 14 },
      },
    },
  },
});

// ── Source avatar ──────────────────────────────────────────────────
function SourceAvatar({ label, bg, color }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 13,
        color: color ?? "#fff",
        flexShrink: 0,
        letterSpacing: "-0.3px",
      }}
    >
      {label}
    </Box>
  );
}

// ── Thin metric label ──────────────────────────────────────────────
function MetricBlock({ label, value }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: "0.8px", textTransform: "uppercase", mb: 0.3 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#ccc" }}>
        {value}
      </Typography>
    </Box>
  );
}

// ── Thin trust bar ─────────────────────────────────────────────────
function TrustBar({ score, color }) {
  return (
    <LinearProgress
      variant="determinate"
      value={score}
      sx={{
        height: 4,
        borderRadius: 4,
        backgroundColor: "#1a1a1a",
        "& .MuiLinearProgress-bar": { backgroundColor: color, borderRadius: 4 },
      }}
    />
  );
}

// ── Source card ────────────────────────────────────────────────────
function SourceCard({ avatar, name, sub, status, schema, recency, conflicts, trustScore, hasIssue }) {
  const statusColor = hasIssue ? "#f59e0b" : "#22c55e";
  const barColor = hasIssue ? "#f59e0b" : "#22c55e";

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 0,
        border: hasIssue ? "1px solid #f59e0b44" : "1px solid #1a1a1a",
        borderRadius: "14px",
        background: hasIssue ? "#0d0b06" : "#0a0a0a",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {avatar}
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#e8e8e8", lineHeight: 1.2 }}>
              {name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#555", mt: 0.2 }}>{sub}</Typography>
          </Box>
        </Box>
        <Chip
          label={status}
          size="small"
          sx={{
            backgroundColor: hasIssue ? "#2a1e0a" : "#0a1f0d",
            color: statusColor,
            border: `1px solid ${statusColor}44`,
            fontSize: 11,
            height: 22,
          }}
        />
      </Box>

      {/* metrics */}
      <Box sx={{ display: "flex", gap: 3 }}>
        <MetricBlock label="Schema" value={schema} />
        <MetricBlock label="Recency" value={recency} />
        <MetricBlock label="Conflicts" value={conflicts} />
      </Box>

      {/* trust */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
          <Typography sx={{ fontSize: 12, color: "#555" }}>Trust score</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: barColor }}>{trustScore}%</Typography>
        </Box>
        <TrustBar score={trustScore} color={barColor} />
      </Box>
    </Paper>
  );
}

// ── Domain reliability row ─────────────────────────────────────────
function DomainRow({ label, score, tag, tagColor, tagBg }) {
  const barColor =
    score >= 90 ? "#22c55e" :
    score >= 75 ? "#22c55e" :
    "#f59e0b";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.2 }}>
      <Typography sx={{ fontSize: 14, color: "#ccc", width: 110, flexShrink: 0 }}>{label}</Typography>
      <Box sx={{ flex: 1 }}>
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            height: 6,
            borderRadius: 4,
            backgroundColor: "#1a1a1a",
            "& .MuiLinearProgress-bar": { backgroundColor: barColor, borderRadius: 4 },
          }}
        />
      </Box>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#666", width: 36, textAlign: "right", flexShrink: 0 }}>
        {score}%
      </Typography>
      <Chip
        label={tag}
        size="small"
        sx={{
          backgroundColor: tagBg,
          color: tagColor,
          fontSize: 11,
          fontWeight: 600,
          height: 22,
          minWidth: 110,
          borderRadius: "8px",
          flexShrink: 0,
        }}
      />
    </Box>
  );
}

// ── Issue row ──────────────────────────────────────────────────────
function IssueRow({ severity, title, meta, actionLabel, isFirst }) {
  const isCritical = severity === "CRITICAL";
  const severityColor = isCritical ? "#ef4444" : "#f59e0b";
  const severityBg = isCritical ? "#1a0808" : "#1a1200";
  const borderColor = isCritical ? "#ef444444" : "#f59e0b44";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        py: 2,
        borderTop: isFirst ? "none" : "1px solid #111",
      }}
    >
      {/* severity badge */}
      <Box sx={{ flexShrink: 0, pt: 0.2 }}>
        <Chip
          label={severity}
          size="small"
          sx={{
            backgroundColor: severityBg,
            color: severityColor,
            border: `1px solid ${borderColor}`,
            fontSize: 10,
            fontWeight: 700,
            height: 22,
            letterSpacing: "0.5px",
            borderRadius: "6px",
          }}
        />
      </Box>

      {/* content */}
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#ddd", mb: 0.4 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{meta}</Typography>
      </Box>

      {/* action */}
      <Button
        size="small"
        variant="outlined"
        sx={{
          borderColor: "#2a2a2a",
          color: "#888",
          fontSize: 12,
          fontWeight: 600,
          height: 30,
          px: 1.5,
          flexShrink: 0,
          "&:hover": { borderColor: "#444", color: "#ccc", background: "#111" },
        }}
      >
        {actionLabel}
      </Button>
    </Box>
  );
}

// ── Section heading ────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 11,
        fontWeight: 700,
        color: "#444",
        letterSpacing: "1.2px",
        textTransform: "uppercase",
        mb: 2,
      }}
    >
      {children}
    </Typography>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function DataTrustDashboard() {
  return (
    <ThemeProvider theme={theme}>
      {/* Outer shell — fills the flex column slot from the parent layout */}
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#000",
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
        }}
      >
      {/* Scrollable content area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          // Custom dark scrollbar
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": { background: "#0a0a0a" },
          "&::-webkit-scrollbar-thumb": {
            background: "#2a2a2a",
            borderRadius: 4,
            "&:hover": { background: "#3a3a3a" },
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#2a2a2a #0a0a0a",
        }}
      >
      {/* Inner width-constrained content */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          pb: 6,
        }}
      >
        {/* ── Page title ── */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#fff", mb: 0.5 }}>
            Data trust
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#555" }}>
            How reliable are Aria's recommendations from your connected data?
          </Typography>
        </Box>

        {/* ── Overall trust banner ── */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #2a1e0a",
            borderRadius: "16px",
            background: "#0d0b06",
            p: 3,
            display: "flex",
            alignItems: "flex-start",
            gap: 3,
            mb: 4,
          }}
        >
          {/* score */}
          <Box sx={{ flexShrink: 0 }}>
            <Typography sx={{ fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1, mb: 0.5 }}>
              71%
            </Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: "1.2px", textTransform: "uppercase" }}>
              Overall trust
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Chip
              label="Low confidence"
              size="small"
              sx={{
                backgroundColor: "#2a1e0a",
                color: "#f59e0b",
                border: "1px solid #f59e0b55",
                fontSize: 11,
                fontWeight: 700,
                height: 22,
                mb: 1,
                letterSpacing: "0.4px",
              }}
            />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#ddd", mb: 0.5 }}>
              Inventory recommendations may be less reliable
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
              Cin7 sync conflicts on 12 SKUs. Aria has flagged related recommendations with lower
              confidence — review them carefully or resolve the data issues to restore reliability.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            sx={{
              flexShrink: 0,
              borderColor: "#2a2a2a",
              color: "#888",
              whiteSpace: "nowrap",
              "&:hover": { borderColor: "#555", color: "#ccc", background: "#111" },
            }}
          >
            Resolve issues
          </Button>
        </Paper>

        {/* ── Connected sources ── */}
        <Box sx={{ mb: 4 }}>
          <SectionLabel>Connected sources</SectionLabel>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <SourceCard
              avatar={<SourceAvatar label="S" bg="#22c55e" />}
              name="Shopify"
              sub="acmeretail.myshopify.com"
              status="Healthy"
              schema="100%"
              recency="4 min"
              conflicts="0"
              trustScore={96}
              hasIssue={false}
            />
            <SourceCard
              avatar={<SourceAvatar label="C7" bg="#292929" color="#ccc" />}
              name="Cin7 Core"
              sub="acme-warehouse"
              status="Issues"
              schema="88%"
              recency="2h"
              conflicts="12"
              trustScore={64}
              hasIssue={true}
            />
            <SourceCard
              avatar={<SourceAvatar label="QB" bg="#0ea5e9" />}
              name="QuickBooks"
              sub="Acme Retail Corp"
              status="Healthy"
              schema="100%"
              recency="1h"
              conflicts="0"
              trustScore={92}
              hasIssue={false}
            />
          </Box>
        </Box>

        {/* ── Reliability by domain ── */}
        <Box sx={{ mb: 4 }}>
          <SectionLabel>Recommendation reliability by domain</SectionLabel>
          <Paper
            elevation={0}
            sx={{ border: "1px solid #1a1a1a", borderRadius: "14px", background: "#0a0a0a", p: 2.5 }}
          >
            <DomainRow label="Sales data" score={94} tag="High reliability" tagColor="#22c55e" tagBg="#0a1f0d" />
            <Divider sx={{ borderColor: "#111" }} />
            <DomainRow label="Inventory data" score={64} tag="Reduced reliability" tagColor="#f59e0b" tagBg="#1a1200" />
            <Divider sx={{ borderColor: "#111" }} />
            <DomainRow label="Vendor data" score={88} tag="High reliability" tagColor="#22c55e" tagBg="#0a1f0d" />
            <Divider sx={{ borderColor: "#111" }} />
            <DomainRow label="Cost data" score={78} tag="High reliability" tagColor="#22c55e" tagBg="#0a1f0d" />
          </Paper>
        </Box>

        {/* ── Active issues ── */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <SectionLabel>Active issues</SectionLabel>
            <Typography sx={{ fontSize: 12, color: "#555", mb: 2 }}>
              3 open · 0 resolved today
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{ border: "1px solid #1a1a1a", borderRadius: "14px", background: "#0a0a0a", p: 2.5 }}
          >
            <IssueRow
              isFirst
              severity="CRITICAL"
              title="Cin7 stock count differs from Shopify on 12 SKUs"
              meta="Detected 1h ago · 12 inventory recommendations flagged as low confidence · suggested: reconcile in Cin7 or set Shopify as source of truth"
              actionLabel="Resolve"
            />
            <IssueRow
              severity="WARNING"
              title="Cin7 schema missing supplier_lead_time field"
              meta="Detected 2d ago · Aria using fallback estimate · suggested: map field in Cin7 settings"
              actionLabel="Map field"
            />
            <IssueRow
              severity="WARNING"
              title="Cin7 last sync 2h ago — expected hourly"
              meta="Detected 1h ago · webhook may be misconfigured · suggested: trigger manual sync to test"
              actionLabel="Sync now"
            />
          </Paper>
        </Box>
      </Box>   {/* inner content */}
      </Box>   {/* scrollable area */}
      </Box>   {/* outer shell */}
    </ThemeProvider>
  );
}