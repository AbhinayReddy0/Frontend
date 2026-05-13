import { Box, Typography } from "@mui/material";

const AGENTS = [
  { id: "forecast", name: "Forecast agent", version: "v2" },
  { id: "vendor", name: "Vendor agent", version: "v2" },
  { id: "po", name: "PO agent", version: "v2" },
];

const CARD_HEIGHT = 200;

export default function AgentPulse() {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: "#888",
          letterSpacing: "0.08em",
          mb: 1.5,
          textTransform: "uppercase",
        }}
      >
        Agent Pulse
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 1.5,
        }}
      >
        {/* Aria — active card */}
        <Box
          sx={{
            height: CARD_HEIGHT,
            bgcolor: "#1a1a1a",
            border: "1px solid #22c55e",
            borderRadius: "20px",
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "#22c55e",
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: 12, color: "#22c55e", fontWeight: 500 }}>
              Running
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#fff", mb: 0.3 }}>
              Aria
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#aaa", mb: 0.3 }}>
              Processing decisions
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#555" }}>
              4 min ago · 0 errors
            </Typography>
          </Box>
        </Box>

        {/* Placeholder cards */}
        {AGENTS.map((agent) => (
          <Box
            key={agent.id}
            sx={{
              height: CARD_HEIGHT,
              bgcolor: "#111",
              border: "1px dashed #222",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#444", textAlign: "center", px: 1 }}>
              {agent.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#333" }}>
              {agent.version}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}