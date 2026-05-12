import { useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box, Typography, Chip, Button, TextField, InputAdornment,
  Select, MenuItem, FormControl, Tooltip, Fade, Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";

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

const ALL_EVENTS = [
  {
    id: 1, time: "9:14 AM", rel: "Today", actor: "SK", actorType: "user",
    title: "You approved recommendation for CT-NAVY-L · 240u from Vendor A",
    detail: "$1,920 · 94% confidence · stockout in 6d cited as reason",
    source: "Slack", status: "Success", action: "Approved", entity: "Recommendation",
  },
  {
    id: 2, time: "9:14 AM", rel: "Today", offset: "+2s", actor: "A", actorType: "aria",
    title: "Aria executed PO-2034 · sent to purchasing@vendora.com",
    detail: "PDF generated · email delivered · awaiting acknowledgment",
    source: "Aria", status: "Success", action: "Executed", entity: "Purchase Order",
  },
  {
    id: 3, time: "8:42 AM", rel: "Today", actor: "A", actorType: "aria",
    title: "Aria parsed reply from Vendor A on PO-2028",
    detail: "Status updated: acknowledged · ETA confirmed Mar 18",
    source: "Aria", status: "Success", action: "Parsed", entity: "Vendor Reply",
  },
  {
    id: 4, time: "7:28 AM", rel: "Today", actor: "SK", actorType: "user",
    title: "You modified recommendation for HD-BLK-M · qty 320 → 240, vendor B → C",
    detail: 'Note: "Vendor B too late, switching for this run"',
    source: "In-app", status: "Success", action: "Modified", entity: "Recommendation",
  },
  {
    id: 5, time: "7:15 AM", rel: "Today", actor: "A", actorType: "aria",
    title: "Aria chased Vendor B on PO-2031 · 2nd reminder",
    detail: "No reply since send Mar 9 · escalation rule triggered",
    source: "Aria", status: "Success", action: "Chased", entity: "Purchase Order",
  },
  {
    id: 6, time: "6:02 AM", rel: "Today", actor: "A", actorType: "aria",
    title: "Aria flagged Cin7 sync conflict on 12 SKUs",
    detail: "Stock counts differ from Shopify · related recommendations marked low confidence",
    source: "Aria", status: "Warning", action: "Flagged", entity: "Sync",
  },
  {
    id: 7, time: "11:42 PM", rel: "Yesterday", actor: "SK", actorType: "user",
    title: "You approved recommendation for BN-CRM-OS · 80u from Vendor A",
    detail: "$640 · 88% confidence · approved from email link",
    source: "Email", status: "Success", action: "Approved", entity: "Recommendation",
  },
  {
    id: 8, time: "11:42 PM", rel: "Yesterday", offset: "+3s", actor: "A", actorType: "aria",
    title: "Aria executed PO-2033 · email failed to vendor",
    detail: "SMTP error · contact email bounced · auto-retry scheduled",
    source: "Aria", status: "Failed", action: "Executed", entity: "Purchase Order",
  },
  {
    id: 9, time: "11:51 PM", rel: "Yesterday", actor: "A", actorType: "aria",
    title: "Aria refreshed forecast on 14 SKUs · Cyber Monday pattern detected",
    detail: "Avg confidence ↑ 84% → 87% · 3 new recommendations queued",
    source: "Aria", status: "Success", action: "Refreshed", entity: "Forecast",
  },
  {
    id: 10, time: "10:08 PM", rel: "Yesterday", actor: "SK", actorType: "user",
    title: "You rejected recommendation for TT-NAT-OS · 60u reorder",
    detail: 'Note: "wait for 30 days more sales data"',
    source: "In-app", status: "Success", action: "Rejected", entity: "Recommendation",
  },
  {
    id: 11, time: "3:30 PM", rel: "Yesterday", actor: "A", actorType: "aria",
    title: "Aria generated 8 new reorder recommendations",
    detail: "Based on updated lead times from Vendor C · avg confidence 81%",
    source: "Aria", status: "Success", action: "Generated", entity: "Recommendation",
  },
  {
    id: 12, time: "1:15 PM", rel: "Yesterday", actor: "SK", actorType: "user",
    title: "You bulk-approved 12 recommendations · $9,840 total",
    detail: "All from Vendor A · confidence range 82–96%",
    source: "Slack", status: "Success", action: "Approved", entity: "Recommendation",
  },
  {
    id: 13, time: "9:00 AM", rel: "Mar 10", actor: "A", actorType: "aria",
    title: "Aria sent PO-2029 to Vendor C · auto-approved under threshold",
    detail: "$340 · under $500 auto-approval limit · confirmation pending",
    source: "Aria", status: "Success", action: "Executed", entity: "Purchase Order",
  },
  {
    id: 14, time: "8:45 AM", rel: "Mar 10", actor: "A", actorType: "aria",
    title: "Aria flagged PO-2027 overdue acknowledgment from Vendor B",
    detail: "Sent Mar 7 · no reply after 3 days · escalation queued",
    source: "Aria", status: "Warning", action: "Flagged", entity: "Purchase Order",
  },
  {
    id: 15, time: "6:00 PM", rel: "Mar 9", actor: "A", actorType: "aria",
    title: "Aria detected stockout risk on WH-GRN-XL · 8 days remaining",
    detail: "Reorder recommendation queued · lead time 12d · high season",
    source: "Aria", status: "Warning", action: "Flagged", entity: "Forecast",
  },
];

const SOURCE_COLORS = {
  Slack: { bg: "#1a2a3a", color: "#4da3e8", border: "#1d4f7a" },
  Aria: { bg: "#111", color: "#8a8a8a", border: "#222" },
  "In-app": { bg: "#1a2a1a", color: "#22c55e", border: "#1a4a1a" },
  Email: { bg: "#2a1a1a", color: "#f97316", border: "#4a2a1a" },
};

const STATUS_CONFIG = {
  Success: { color: "#22c55e", bg: "#0a1f0a", icon: <CheckCircleOutlineIcon sx={{ fontSize: 13 }} /> },
  Warning: { color: "#f59e0b", bg: "#1f1a0a", icon: <WarningAmberIcon sx={{ fontSize: 13 }} /> },
  Failed: { color: "#ef4444", bg: "#1f0a0a", icon: <CancelIcon sx={{ fontSize: 13 }} /> },
};

function FilterSelect({ label, options, value, onChange }) {
  return (
    <FormControl size="small">
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          color: value !== "all" ? "#fff" : "#8a8a8a",
          fontSize: 13,
          fontWeight: 600,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#1e1e1e" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#333" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#22c55e" },
          "& .MuiSvgIcon-root": { color: "#555", fontSize: 16 },
          background: "#0d0d0d",
          borderRadius: "10px",
          minWidth: 110,
          height: 36,
          pl: 0.5,
        }}
        renderValue={(v) => v === "all" ? label : v}
      >
        <MenuItem value="all" sx={{ fontSize: 13, color: "#8a8a8a" }}>All {label}s</MenuItem>
        {options.map((o) => (
          <MenuItem key={o} value={o} sx={{ fontSize: 13 }}>{o}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function StatCard({ label, value, sub, highlight, onClick, active }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        px: 3, py: 2,
        borderRight: "1px solid #111",
        minWidth: 140,
        transition: "background 0.2s",
        background: active ? "#0d1a0d" : "transparent",
        "&:hover": onClick ? { background: "#0d0d0d" } : {},
        "&:last-child": { borderRight: "none" },
      }}
    >
      <Typography sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#555", textTransform: "uppercase", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: highlight ? "#ef4444" : "#fff", letterSpacing: "-1px" }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#555", mt: 0.5 }}>{sub}</Typography>
    </Box>
  );
}

function ActorBadge({ actor, actorType }) {
  const isAria = actorType === "aria";
  return (
    <Tooltip title={isAria ? "Aria (AI Agent)" : "You (SK)"} placement="top">
      <Avatar
        sx={{
          width: 28,
          height: 28,
          fontSize: 11,
          fontWeight: 700,
          background: isAria ? "linear-gradient(135deg, #1a2a1a, #0d1f0d)" : "#1a1a2a",
          border: isAria ? "1.5px solid #22c55e33" : "1.5px solid #3333aa33",
          color: isAria ? "#22c55e" : "#818cf8",
          flexShrink: 0,
        }}
      >
        {isAria ? <AutoAwesomeIcon sx={{ fontSize: 13 }} /> : actor}
      </Avatar>
    </Tooltip>
  );
}

export default function AuditLog() {
  const [search, setSearch] = useState("");
  const [actorFilter, setActorFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("Last 30 days");
  const [failedActive, setFailedActive] = useState(false);

  const actors = ["You", "Aria"];
  const actions = [...new Set(ALL_EVENTS.map((e) => e.action))];
  const entities = [...new Set(ALL_EVENTS.map((e) => e.entity))];
  const sources = [...new Set(ALL_EVENTS.map((e) => e.source))];
  const statuses = ["Success", "Warning", "Failed"];

  const filtered = useMemo(() => {
    return ALL_EVENTS.filter((ev) => {
      if (failedActive && ev.status !== "Failed") return false;
      if (actorFilter !== "all") {
        if (actorFilter === "You" && ev.actorType !== "user") return false;
        if (actorFilter === "Aria" && ev.actorType !== "aria") return false;
      }
      if (actionFilter !== "all" && ev.action !== actionFilter) return false;
      if (entityFilter !== "all" && ev.entity !== entityFilter) return false;
      if (sourceFilter !== "all" && ev.source !== sourceFilter) return false;
      if (statusFilter !== "all" && ev.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!ev.title.toLowerCase().includes(q) && !ev.detail.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, actorFilter, actionFilter, entityFilter, sourceFilter, statusFilter, failedActive]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((ev) => {
      if (!groups[ev.rel]) groups[ev.rel] = [];
      groups[ev.rel].push(ev);
    });
    return groups;
  }, [filtered]);

  const approvals = ALL_EVENTS.filter((e) => e.action === "Approved" || e.action === "Rejected").length;
  const executions = ALL_EVENTS.filter((e) => e.actorType === "aria").length;
  const fromSlack = ALL_EVENTS.filter((e) => e.source === "Slack").length;
  const failed = ALL_EVENTS.filter((e) => e.status === "Failed").length;

  const activeFilterCount = [actorFilter, actionFilter, entityFilter, sourceFilter, statusFilter].filter(v => v !== "all").length + (failedActive ? 1 : 0);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ background: "#000", height: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <Box sx={{ px: 4, pt: 4, pb: 0, flexShrink: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
                Audit log
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#555", mt: 0.3 }}>
                1,247 events in last 30 days · every approval, execution, and system event recorded
              </Typography>
            </Box>
            <Button
              startIcon={<DownloadIcon sx={{ fontSize: 15 }} />}
              variant="outlined"
              sx={{
                borderColor: "#1e1e1e",
                color: "#8a8a8a",
                fontSize: 12,
                py: 0.8,
                px: 2,
                borderRadius: "10px",
                "&:hover": { borderColor: "#333", color: "#fff", background: "#0d0d0d" },
              }}
            >
              Export CSV
            </Button>
          </Box>

          {/* Stats Row */}
          <Box sx={{ display: "flex", borderTop: "1px solid #111", borderBottom: "1px solid #111", mb: 3 }}>
            <StatCard label="Approvals" value={approvals} sub="by you" />
            <StatCard label="Executions" value={executions} sub={`by Aria · ${failed} failed`} />
            <StatCard label="From Slack" value={fromSlack} sub="37% of approvals" />
            <StatCard
              label="Failed"
              value={failed}
              sub="click to filter"
              highlight
              active={failedActive}
              onClick={() => setFailedActive((v) => !v)}
            />
          </Box>

          {/* Filter Strip */}
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5, mb: 3,
            flexWrap: "wrap",
          }}>
            {/* Time range */}
            <FormControl size="small">
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  color: "#fff", fontSize: 13, fontWeight: 700,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#22c55e44" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#22c55e88" },
                  "& .MuiSvgIcon-root": { color: "#22c55e", fontSize: 16 },
                  background: "#0a1a0a",
                  borderRadius: "10px",
                  height: 36,
                }}
              >
                {["Last 7 days", "Last 30 days", "Last 90 days", "All time"].map((t) => (
                  <MenuItem key={t} value={t} sx={{ fontSize: 13 }}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ width: "1px", height: 24, background: "#1e1e1e" }} />

            <FilterSelect label="Actor" options={actors} value={actorFilter} onChange={setActorFilter} />
            <FilterSelect label="Action" options={actions} value={actionFilter} onChange={setActionFilter} />
            <FilterSelect label="Entity" options={entities} value={entityFilter} onChange={setEntityFilter} />
            <FilterSelect label="Source" options={sources} value={sourceFilter} onChange={setSourceFilter} />
            <FilterSelect label="Status" options={statuses} value={statusFilter} onChange={setStatusFilter} />

            {activeFilterCount > 0 && (
              <Tooltip title="Clear all filters">
                <Button
                  size="small"
                  onClick={() => {
                    setActorFilter("all"); setActionFilter("all");
                    setEntityFilter("all"); setSourceFilter("all");
                    setStatusFilter("all"); setFailedActive(false);
                  }}
                  sx={{
                    fontSize: 12, color: "#ef4444", borderColor: "#2a1a1a",
                    border: "1px solid #2a1a1a", py: 0.6, px: 1.5,
                    borderRadius: "10px", background: "#0d0505",
                    "&:hover": { background: "#1a0a0a", borderColor: "#ef4444" },
                  }}
                >
                  Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
                </Button>
              </Tooltip>
            )}

            <Box sx={{ ml: "auto" }}>
              <TextField
                size="small"
                placeholder="Search reasoning, SKUs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16, color: "#555" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: 240,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    background: "#0d0d0d",
                    height: 36,
                    fontSize: 13,
                    "& fieldset": { borderColor: "#1e1e1e" },
                    "&:hover fieldset": { borderColor: "#333" },
                    "&.Mui-focused fieldset": { borderColor: "#22c55e" },
                  },
                  "& input::placeholder": { color: "#444", fontSize: 13 },
                }}
              />
            </Box>
          </Box>

          {/* Column Headers */}
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "120px 36px 1fr 90px 90px",
            gap: 2,
            px: 2, pb: 1.5,
            borderBottom: "1px solid #0d0d0d",
          }}>
            {["When", "", "Event", "Source", "Status"].map((h, i) => (
              <Typography key={i} sx={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", color: "#444", textTransform: "uppercase" }}>
                {h}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Event Feed */}
        <Box sx={{
          px: 4, pb: 6,
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "#080808" },
          "&::-webkit-scrollbar-thumb": { background: "#1e1e1e", borderRadius: "4px" },
          "&::-webkit-scrollbar-thumb:hover": { background: "#2e2e2e" },
        }}>
          {Object.keys(grouped).length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography sx={{ color: "#333", fontSize: 14 }}>No events match your filters</Typography>
            </Box>
          ) : (
            Object.entries(grouped).map(([day, events]) => (
              <Box key={day}>
                {/* Day separator */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2, mt: 1 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", color: "#333", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {day}
                  </Typography>
                  <Box sx={{ flex: 1, height: "1px", background: "#0d0d0d" }} />
                </Box>

                {events.map((ev, idx) => {
                  const srcStyle = SOURCE_COLORS[ev.source] || SOURCE_COLORS["Aria"];
                  const stsCfg = STATUS_CONFIG[ev.status] || STATUS_CONFIG["Success"];

                  return (
                    <Fade in key={ev.id} timeout={300}>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "120px 36px 1fr 90px 90px",
                          gap: 2,
                          px: 2,
                          py: 1.8,
                          borderBottom: "1px solid #080808",
                          alignItems: "center",
                          borderRadius: "8px",
                          transition: "background 0.15s",
                          "&:hover": { background: "#050505" },
                          position: "relative",
                        }}
                      >
                        {/* When */}
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#ccc", fontVariantNumeric: "tabular-nums" }}>
                            {ev.time}
                          </Typography>
                          {ev.offset && (
                            <Typography sx={{ fontSize: 11, color: "#333", mt: 0.2 }}>{ev.offset}</Typography>
                          )}
                        </Box>

                        {/* Actor */}
                        <ActorBadge actor={ev.actor} actorType={ev.actorType} />

                        {/* Event */}
                        <Box>
                          <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: "#e0e0e0", lineHeight: 1.4, mb: 0.4 }}>
                            {ev.title}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "#555", lineHeight: 1.4 }}>
                            {ev.detail}
                          </Typography>
                        </Box>

                        {/* Source */}
                        <Box>
                          {ev.source !== "Aria" ? (
                            <Chip
                              label={ev.source}
                              size="small"
                              sx={{
                                fontSize: 11, fontWeight: 600,
                                background: srcStyle.bg,
                                color: srcStyle.color,
                                border: `1px solid ${srcStyle.border}`,
                                borderRadius: "8px",
                                height: 22,
                              }}
                            />
                          ) : (
                            <Typography sx={{ fontSize: 12, color: "#444", fontWeight: 600 }}>Aria</Typography>
                          )}
                        </Box>

                        {/* Status */}
                        <Box>
                          <Box sx={{
                            display: "inline-flex", alignItems: "center", gap: 0.5,
                            px: 1.2, py: 0.4,
                            borderRadius: "8px",
                            background: stsCfg.bg,
                            border: `1px solid ${stsCfg.color}22`,
                          }}>
                            <Box sx={{ color: stsCfg.color, display: "flex", alignItems: "center" }}>
                              {stsCfg.icon}
                            </Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 700, color: stsCfg.color }}>
                              {ev.status}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Fade>
                  );
                })}
              </Box>
            ))
          )}

          {/* Footer */}
          <Box sx={{ pt: 4, textAlign: "center" }}>
            <Typography sx={{ fontSize: 12, color: "#2a2a2a" }}>
              Showing {filtered.length} of 1,247 events · {timeFilter.toLowerCase()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}