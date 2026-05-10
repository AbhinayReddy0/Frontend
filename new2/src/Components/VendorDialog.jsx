import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  Tabs, Tab, Box, Typography, IconButton, Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import TabOverview from "./TabOverview";
import TabPerformance from "./TabPerformance";
import TabPOs from "./TabPOs";
import TabComms from "./TabComms";

const TABS = ["Overview", "Performance", "POs", "Comms"];

export default function VendorDialog({ vendor, onClose }) {
  const [tab, setTab] = useState(0);

  if (!vendor) return null;

  const content = [
    <TabOverview    key="ov"   v={vendor} />,
    <TabPerformance key="perf" v={vendor} />,
    <TabPOs         key="pos"  v={vendor} />,
    <TabComms       key="cm"   v={vendor} />,
  ];

  return (
    <Dialog
      open={!!vendor}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          background: "#080808",
          border: "1px solid #1a1a1a",
          borderRadius: "12px",
          maxHeight: "88vh",
          fontFamily: "'Courier New', monospace",
        },
      }}
      BackdropProps={{ sx: { background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" } }}
    >
      {/* ── Dialog Header ── */}
      <DialogTitle sx={{ p: 0, background: "#050505", borderBottom: "1px solid #111" }}>
        <Box sx={{ px: 2.5, py: 1.8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Avatar */}
            <Box sx={{
              width: 42, height: 42, borderRadius: "10px",
              background: vendor.avatarBg, color: vendor.avatarColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 12, letterSpacing: "0.5px",
              border: `1px solid ${vendor.accentColor}33`,
              flexShrink: 0,
            }}>
              {vendor.label}
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                  {vendor.name}
                </Typography>
                {/* Rank badge */}
                <Box sx={{
                  display: "inline-flex", alignItems: "center", px: 1, py: 0.2,
                  borderRadius: "5px", fontSize: 10, fontWeight: 700,
                  ...vendor.rankStyle,
                }}>
                  {vendor.rankLabel}
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.3 }}>
                <EmailIcon sx={{ fontSize: 11, color: "#444" }} />
                <Typography sx={{ fontSize: 11, color: "#555" }}>{vendor.email}</Typography>
                <Typography sx={{ fontSize: 11, color: "#333" }}>·</Typography>
                <Typography sx={{ fontSize: 11, color: "#555" }}>{vendor.sub}</Typography>
              </Box>
            </Box>
          </Box>

          <IconButton onClick={onClose} size="small" sx={{ color: "#555", "&:hover": { color: "#fff" } }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        {/* Quick KPI strip */}
        <Box sx={{
          display: "flex", borderTop: "1px solid #111",
          "& > *:not(:last-child)": { borderRight: "1px solid #111" },
        }}>
          {[
            { label: "On-Time",   value: `${vendor.onTime}%`   },
            { label: "Accuracy",  value: `${vendor.accuracy}%` },
            { label: "Avg Lead",  value: vendor.avgLead         },
            { label: "Open POs",  value: vendor.openPOs         },
            { label: "Lifetime",  value: vendor.lifetime        },
          ].map((kpi) => (
            <Box key={kpi.label} sx={{ flex: 1, px: 2, py: 1, textAlign: "center" }}>
              <Typography sx={{ fontSize: 9, color: "#555", letterSpacing: "0.8px", mb: 0.3 }}>
                {kpi.label.toUpperCase()}
              </Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: vendor.accentColor }}>
                {kpi.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 2,
            minHeight: 40,
            borderTop: "1px solid #111",
            "& .MuiTabs-flexContainer": { gap: 0 },
          }}
        >
          {TABS.map((t) => (
            <Tab
              key={t} label={t}
              sx={{
                fontSize: 11, minHeight: 40, py: 0.5, px: 1.5,
                fontFamily: "'Courier New', monospace",
                color: "#555", letterSpacing: "0.5px",
                "&.Mui-selected": { color: vendor.accentColor },
              }}
            />
          ))}
        </Tabs>
        <Box component="style">{`
          .MuiTabs-indicator { background-color: ${vendor.accentColor} !important; }
        `}</Box>
      </DialogTitle>

      {/* ── Dialog Content ── */}
      <DialogContent
        dividers={false}
        sx={{
          p: 0, background: "#080808",
          "&::-webkit-scrollbar": { width: 5 },
          "&::-webkit-scrollbar-track": { background: "#080808" },
          "&::-webkit-scrollbar-thumb": { background: "#1a1a1a", borderRadius: 3 },
        }}
      >
        {content[tab]}
      </DialogContent>
    </Dialog>
  );
}
