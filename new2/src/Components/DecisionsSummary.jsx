import { Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DECISIONS = [
  {
    id: 1,
    title: "Reorder 240u — Cotton tee navy L",
    sub: "Stockout in 6d · $1,920",
    confidence: 94,
    urgency: "Urgent",
    urgencyColor: { bg: "#4a1a1a", text: "#ff6b6b" },
  },
  {
    id: 2,
    title: "Switch vendor — Hoodie black M",
    sub: "Vendor B 8d late · $4,200",
    confidence: 71,
    urgency: "Today",
    urgencyColor: { bg: "#3a2e00", text: "#c9a227" },
  },
  {
    id: 3,
    title: "Reorder 80u — Beanie cream OS",
    sub: "Promo in 12d · $640",
    confidence: 88,
    urgency: "This wk",
    urgencyColor: { bg: "#0c1e3a", text: "#4a8aff" },
  },
];

const CAPITAL = [
  { label: "Open POs", value: "$32,400" },
  { label: "In-flight inventory", value: "$12,800" },
  { label: "Held for reorder", value: "$3,000" },
];

export default function DecisionsSummary({ onOpenQueue }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>

      {/* ── Top: Decisions (full width) ── */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#111",
          border: "1px solid #222",
          borderRadius: "14px",
          p: 2.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              12 decisions
            </Typography>
            <Typography sx={{ fontSize: 13, color: "#555", mt: 0.5 }}>
              awaiting your review · $48,200 total impact
            </Typography>
          </Box>
          <Box
            onClick={onOpenQueue}
            sx={{
              display: "flex", alignItems: "center", gap: 0.5,
              color: "#4a8aff", fontSize: 13, fontWeight: 500,
              cursor: "pointer", flexShrink: 0, mt: 0.5,
              "&:hover": { opacity: 0.8 },
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#4a8aff", fontWeight: 500 }}>
              Open queue
            </Typography>
            <ArrowForwardIcon sx={{ fontSize: 14, color: "#4a8aff" }} />
          </Box>
        </Box>

        {/* Decision rows */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {DECISIONS.map((d) => (
            <Box
              key={d.id}
              sx={{
                bgcolor: "#161616",
                border: "1px solid #222",
                borderRadius: "10px",
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#e8e8e8", mb: 0.3 }}>
                  {d.title}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#555" }}>
                  {d.sub}
                </Typography>
              </Box>

              {/* Confidence */}
              <Box
                sx={{
                  bgcolor: "#1e2a1e", borderRadius: "8px",
                  px: 1.2, py: 0.4, flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#a3e635" }}>
                  {d.confidence}%
                </Typography>
              </Box>

              {/* Urgency badge */}
              <Box
                sx={{
                  bgcolor: d.urgencyColor.bg,
                  borderRadius: "8px",
                  px: 1.5, py: 0.4, flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: d.urgencyColor.text }}>
                  {d.urgency}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Bottom: Capital at Work (full width) ── */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#111",
          border: "1px solid #222",
          borderRadius: "14px",
          p: 2.5,
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: "0.1em", mb: 1.5 }}>
          CAPITAL AT WORK
        </Typography>

        {/* Top row: big number + breakdown side by side */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
          {/* Left: total */}
          <Box sx={{ flexShrink: 0 }}>
            <Typography sx={{ fontSize: 36, fontWeight: 700, color: "#fff", lineHeight: 1, mb: 0.5 }}>
              $48,200
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#555" }}>
              committed by Aria
            </Typography>
          </Box>

          {/* Right: breakdown stretched across remaining width */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
            {CAPITAL.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                  borderTop: i === 0 ? "1px solid #1e1e1e" : "none",
                  borderBottom: "1px solid #1e1e1e",
                }}
              >
                <Typography sx={{ fontSize: 13, color: "#888" }}>
                  {item.label}
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

    </Box>
  );
}