import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Tooltip,
  InputBase,
  Collapse,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import CloseIcon from "@mui/icons-material/Close";

export default function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <Box
      sx={{
        width: "100%",
        height: 56,
        backgroundColor: "#0a0a0a",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2.5,
        flexShrink: 0,
        gap: 2,
      }}
    >
      {/* ── Left: Logo + Company Name ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* Placeholder logo — swap with <img> if you have a logo URL */}
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "4px",
              background: "rgba(255,255,255,0.15)",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: "0.02em",
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Acme Retail
        </Typography>
      </Box>

      {/* ── Right: Actions ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>

        {/* Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: searchOpen ? "rgba(255,255,255,0.06)" : "transparent",
            border: searchOpen ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
            borderRadius: "8px",
            px: searchOpen ? 1.5 : 0.5,
            transition: "all 0.2s ease",
            height: 36,
          }}
        >
          <Tooltip title="Search" placement="bottom">
            <IconButton
              size="small"
              onClick={() => {
                setSearchOpen((p) => !p);
                setSearchValue("");
              }}
              sx={{
                color: searchOpen ? "#fff" : "#555",
                p: 0.6,
                "&:hover": { color: "#fff", backgroundColor: "transparent" },
              }}
            >
              {searchOpen ? (
                <CloseIcon sx={{ fontSize: 17 }} />
              ) : (
                <SearchIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>

          <Collapse in={searchOpen} orientation="horizontal" timeout={200}>
            <InputBase
              autoFocus
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                color: "#fff",
                fontSize: 13,
                width: 160,
                "& input::placeholder": { color: "#555", opacity: 1 },
              }}
            />
          </Collapse>
        </Box>

        {/* Pause Aria button */}
        <Tooltip title="Pause Aria agent" placement="bottom">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.7,
              borderRadius: "8px",
              backgroundColor: "rgba(180,30,30,0.25)",
              border: "1px solid rgba(200,50,50,0.3)",
              cursor: "pointer",
              transition: "all 0.18s ease",
              "&:hover": {
                backgroundColor: "rgba(200,40,40,0.35)",
                border: "1px solid rgba(220,60,60,0.45)",
              },
            }}
          >
            {/* Live dot */}
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#e05050",
                boxShadow: "0 0 6px rgba(220,60,60,0.8)",
                animation: "pulse 1.8s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.4 },
                },
              }}
            />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#e07070",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Pause Aria
            </Typography>
          </Box>
        </Tooltip>

        {/* Notification bell */}
        <Tooltip title="Notifications" placement="bottom">
          <IconButton
            size="small"
            sx={{
              color: "#555",
              p: 0.8,
              ml: 0.5,
              "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.07)" },
            }}
          >
            <Badge
              badgeContent={12}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#4a8aff",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  minWidth: 18,
                  height: 18,
                  borderRadius: "9px",
                  padding: "0 4px",
                  border: "1.5px solid #0a0a0a",
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: 19 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User avatar */}
        <Tooltip title="Sarah K." placement="bottom">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              ml: 0.5,
              fontSize: 12,
              fontWeight: 700,
              backgroundColor: "#2a3a5a",
              color: "#7ab0ff",
              border: "1.5px solid rgba(74,138,255,0.3)",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.03em",
              "&:hover": {
                border: "1.5px solid rgba(74,138,255,0.6)",
              },
              transition: "border 0.18s ease",
            }}
          >
            SK
          </Avatar>
        </Tooltip>
      </Box>
    </Box>
  );
}