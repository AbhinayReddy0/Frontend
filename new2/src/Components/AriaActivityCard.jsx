import {
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";

const accentColor = "#4a8aff";

const ARIA_DATA = {
  actions: [
    { time: "2:14 AM",  title: "Auto-approved reorder of CT-NAVY-L",   subtitle: "$1,920 · Vendor A · 240 units",            type: "reorder"         },
    { time: "1:47 AM",  title: "PO sent to Vendor B for SKU HD-BLK-M", subtitle: "$3,450 · 300 units · Net 30",              type: "po_sent"         },
    { time: "12:58 AM", title: "Switched supplier for SKU JK-GRY-XL",  subtitle: "Vendor C → Vendor D · $0.40/unit savings", type: "vendor_switch"   },
    { time: "11:32 PM", title: "Forecast updated for SKU TS-WHT-S",    subtitle: "Demand up 18% · Next 14 days",             type: "forecast_update" },
  ],
  totalActions: 14,
  flags: [
    { severity: "high",   title: "Demand spike on Hoodie Black M", description: "3.2x normal velocity in last 48h. Stockout risk in 4 days."  },
    { severity: "medium", title: "Vendor C shipment delayed",       description: "PO #4821 delayed by 6 days. 3 SKUs affected."                },
    { severity: "low",    title: "Price anomaly on SKU JK-GRY-S",  description: "Unit cost 12% above 30-day average. Review suggested."       },
    { severity: "low",    title: "Price anomaly on SKU JK-GRY-S",  description: "Unit cost 12% above 30-day average. Review suggested."       }
  ],
  totalExceptions: 3,
};

const SeverityDot = ({ severity }) => {
  const colors = {
    high:   { bg: "#e05050", glow: "rgba(220,60,60,0.7)"  },
    medium: { bg: "#e09030", glow: "rgba(200,130,30,0.7)" },
    low:    { bg: "#4a8aff", glow: "rgba(74,138,255,0.5)" },
  };
  const c = colors[severity] || colors.low;
  return (
    <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c.bg, boxShadow: `0 0 6px ${c.glow}`, flexShrink: 0, mt: "3px" }} />
  );
};

const actionBadgeColor = (type) => ({
  reorder:         { bg: "rgba(74,138,255,0.12)",  color: "#6ab0ff" },
  po_sent:         { bg: "rgba(100,200,120,0.12)", color: "#70cc90" },
  vendor_switch:   { bg: "rgba(200,150,50,0.12)",  color: "#ddaa50" },
  forecast_update: { bg: "rgba(160,100,220,0.12)", color: "#bb88ee" },
}[type] || { bg: "rgba(255,255,255,0.07)", color: "#999" });

export default function AriaActivityCard() {
  const { actions, totalActions, flags, totalExceptions } = ARIA_DATA;

  return (
    <Box
      sx={{
        mt: 3,
        pt: 2.5,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        // ✅ Force this component to always fill whatever parent it's in
        display: "block",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Typography
        sx={{ fontSize: 11, fontWeight: 600, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", mb: 2 }}
      >
        Aria Activity
      </Typography>

      {/* ✅ CSS Grid — most reliable 50/50 split, no flex quirks */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* ── Left card ── */}
        <Box
          sx={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            p: 2,
            // ✅ minWidth:0 is the single most important fix for grid children
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
              What Aria did (24h)
            </Typography>
            <Chip
              label={`${totalActions} actions`}
              size="small"
              sx={{ backgroundColor: "rgba(255,255,255,0.06)", color: "#888", fontSize: 11, height: 22, flexShrink: 0 }}
            />
          </Box>

          <Box>
            {actions.map((action, i) => {
              const badge = actionBadgeColor(action.type);
              return (
                <Box key={i}>
                  <Box sx={{ display: "flex", gap: 1.5, py: 1.5, "&:hover .action-title": { color: "#fff" }, "&:hover .view-btn": { opacity: 1 } }}>
                    <Typography sx={{ fontSize: 11, color: "#444", minWidth: 52, pt: "2px", fontFamily: "monospace", flexShrink: 0 }}>
                      {action.time}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 0.3 }}>
                        <Typography
                          className="action-title"
                          sx={{ fontSize: 13, fontWeight: 500, color: "#ddd", lineHeight: 1.4, flex: 1, minWidth: 0, transition: "color 0.15s", wordBreak: "break-word" }}
                        >
                          {action.title}
                        </Typography>
                        <Tooltip title="View details" placement="top">
                          <IconButton className="view-btn" size="small" sx={{ opacity: 0, p: 0.3, color: accentColor, transition: "opacity 0.15s", flexShrink: 0 }}>
                            <OpenInNewIcon sx={{ fontSize: 13 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography sx={{ fontSize: 11.5, color: "#555" }}>{action.subtitle}</Typography>
                      <Box sx={{ display: "inline-block", mt: 0.5, px: 0.8, py: 0.2, borderRadius: "4px", backgroundColor: badge.bg, color: badge.color, fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {action.type.replace("_", " ")}
                      </Box>
                    </Box>
                  </Box>
                  {i < actions.length - 1 && <Divider sx={{ borderColor: "rgba(255,255,255,0.04)" }} />}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ── Right card ── */}
        <Box
          sx={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px",
            p: 2,
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#fff", flexShrink: 0 }}>
              Things Aria flagged
            </Typography>
            <Chip
              label={`${totalExceptions} exceptions`}
              size="small"
              sx={{ backgroundColor: "rgba(220,60,60,0.1)", color: "#e07070", fontSize: 11, height: 22, flexShrink: 0 }}
            />
          </Box>

          <Box>
            {flags.map((flag, i) => (
              <Box key={i}>
                <Box sx={{ display: "flex", gap: 1.5, py: 1.5, "&:hover .flag-title": { color: "#fff" } }}>
                  <SeverityDot severity={flag.severity} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      className="flag-title"
                      sx={{ fontSize: 13, fontWeight: 500, color: "#ddd", lineHeight: 1.4, mb: 0.4, transition: "color 0.15s", wordBreak: "break-word" }}
                    >
                      {flag.title}
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: "#555", lineHeight: 1.5 }}>
                      {flag.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-block", mt: 0.5, px: 0.8, py: 0.2, borderRadius: "4px",
                        backgroundColor: flag.severity === "high" ? "rgba(220,60,60,0.12)" : flag.severity === "medium" ? "rgba(200,130,30,0.12)" : "rgba(74,138,255,0.12)",
                        color: flag.severity === "high" ? "#e07070" : flag.severity === "medium" ? "#ddaa50" : "#6ab0ff",
                        fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                      }}
                    >
                      {flag.severity}
                    </Box>
                  </Box>
                </Box>
                {i < flags.length - 1 && <Divider sx={{ borderColor: "rgba(255,255,255,0.04)" }} />}
              </Box>
            ))}
          </Box>
        </Box>

      </Box>
    </Box>
  );
}