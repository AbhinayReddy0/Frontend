import { Box, Typography } from "@mui/material";

const AGENTS = [
  { id: "forecast", name: "Forecast agent", version: "v2" },
  { id: "vendor", name: "Vendor agent", version: "v2" },
  { id: "po", name: "PO agent", version: "v2" },
];

export default function AgentPulse() {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.1em", mb: 1.5 }}
      >
        AGENT PULSE
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>

        {/* Aria — active square card */}
        <Box
          sx={{
            width: 160,
            height: 160,
            bgcolor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "20px",        // ✅ rounder
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Box
              sx={{
                width: 7, height: 7,
                borderRadius: "50%",
                bgcolor: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: 12, color: "#22c55e", fontWeight: 500 }}>
              Running
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#fff", mb: 0.3 }}>
              Aria
            </Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#e8e8e8", mb: 0.3 }}>
              Processing decisions
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#444" }}>
              4 min ago · 0 errors
            </Typography>
          </Box>
        </Box>

        {/* Placeholder agent square cards */}
        {AGENTS.map((agent) => (
          <Box
            key={agent.id}
            sx={{
              width: 160,
              height: 160,
              bgcolor: "#111",
              border: "1px dashed #222",
              borderRadius: "20px",      // ✅ rounder
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              flexShrink: 0,
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