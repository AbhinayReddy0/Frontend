import { Box, Typography, InputBase, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export default function TabComms({ v }) {
  const [msg, setMsg] = useState("");

  return (
    <Box>
      <Typography sx={{ fontSize: 10, color: "#555", letterSpacing: "1px", px: 2, pt: 1.5, pb: 0.5 }}>
        COMMUNICATION THREAD
      </Typography>

      <Box>
        {v.comms.map((c, i) => {
          const isAria = c.from.startsWith("Aria");
          return (
            <Box
              key={i}
              sx={{
                px: 2, py: 1.5,
                borderBottom: "1px solid #0d0d0d",
                borderLeft: `2px solid ${isAria ? "#22c55e" : v.accentColor}22`,
                background: isAria ? "#040f07" : "#050505",
                transition: "background 0.15s",
                "&:hover": { background: "#0d0d0d" },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography sx={{
                  fontSize: 10, fontWeight: 700,
                  color: isAria ? "#22c55e" : v.accentColor,
                }}>
                  {c.from}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "#444" }}>{c.time}</Typography>
              </Box>
              <Typography sx={{ fontSize: 11.5, color: "#bbb", lineHeight: 1.7 }}>
                "{c.text}"
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Message input */}
      <Box sx={{
        mx: 2, my: 1.5, display: "flex", alignItems: "center", gap: 1,
        border: "1px solid #222", borderRadius: 1.5, px: 1.5, py: 0.5,
        background: "#080808",
        "&:focus-within": { border: "1px solid #333" },
      }}>
        <InputBase
          fullWidth
          placeholder="Send a message to vendor..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          sx={{
            color: "#ccc", fontSize: 12,
            fontFamily: "'Courier New', monospace",
            "& ::placeholder": { color: "#444" },
          }}
        />
        <IconButton
          size="small"
          onClick={() => setMsg("")}
          sx={{ color: msg ? "#22c55e" : "#333", transition: "color 0.2s" }}
        >
          <SendIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
