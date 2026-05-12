import { useState, useRef, useEffect } from "react";
import ProfilePage from "./ProfilePage";
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Tooltip,
  InputBase,
  Collapse,
  Divider,
  Paper,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  PersonOutlined as PersonOutlineIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  InfoOutlined as HelpOutlineIcon,
  Logout as LogoutIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";

// ── Profile menu items ──────────────────────────────────────────
const MENU_ITEMS = [
  { icon: PersonOutlineIcon, label: "My profile", active: true },
  { icon: SettingsOutlinedIcon, label: "Workspace settings", active: false },
  { icon: HelpOutlineIcon, label: "Help & docs", active: false },
];

// ── Profile Dropdown ────────────────────────────────────────────
function ProfileDropdown({ anchorEl, open, onClose, onMenuClick }) {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !anchorEl?.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, anchorEl, onClose]);

  return (
    <Fade in={open} timeout={160}>
      <Paper
        ref={ref}
        elevation={0}
        sx={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: 240,
          backgroundColor: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          overflow: "hidden",
          zIndex: 1400,
          boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)",
          // Subtle inner top highlight
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          },
        }}
      >
        {/* ── User header ── */}
        <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.01em",
            }}
          >
            Sarah Khan
          </Typography>
          <Typography
            sx={{
              fontSize: 11.5,
              color: "#555",
              fontFamily: "'Inter', sans-serif",
              mt: 0.25,
            }}
          >
            sarah@acmeretail.com
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 0 }} />

        {/* ── Menu items ── */}
        <Box sx={{ py: 0.75 }}>
          {MENU_ITEMS.map(({ icon: Icon, label, active }) => (
            <Box
              key={label}
              onClick={() => { onClose(); onMenuClick(label); }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 0.85,
                mx: 0.75,
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: active ? "rgba(34,197,94,0.1)" : "transparent",
                transition: "background 0.15s ease",
                "&:hover": {
                  backgroundColor: active
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(255,255,255,0.05)",
                },
              }}
            >
              <Icon
                sx={{
                  fontSize: 16,
                  color: active ? "#22c55e" : "#555",
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#e8fdf0" : "#aaa",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.01em",
                }}
              >
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

        {/* ── Sign out ── */}
        <Box sx={{ py: 0.75 }}>
          <Box
            onClick={onClose}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 0.85,
              mx: 0.75,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.15s ease",
              "&:hover": {
                backgroundColor: "rgba(239,68,68,0.08)",
                "& .sign-out-icon, & .sign-out-text": {
                  color: "#f87171",
                },
              },
            }}
          >
            <LogoutIcon
              className="sign-out-icon"
              sx={{ fontSize: 16, color: "#555", flexShrink: 0, transition: "color 0.15s" }}
            />
            <Typography
              className="sign-out-text"
              sx={{
                fontSize: 13,
                fontWeight: 400,
                color: "#aaa",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.01em",
                transition: "color 0.15s",
              }}
            >
              Sign out
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
}

// ── TopBar ──────────────────────────────────────────────────────
export default function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePageOpen, setProfilePageOpen] = useState(false);
  const avatarRef = useRef(null);

  return (
    <>
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
        position: "relative",
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
            fontFamily: "'Inter', sans-serif",
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
              onClick={() => { setSearchOpen((p) => !p); setSearchValue(""); }}
              sx={{
                color: searchOpen ? "#fff" : "#555",
                p: 0.6,
                "&:hover": { color: "#fff", backgroundColor: "transparent" },
              }}
            >
              {searchOpen
                ? <CloseIcon sx={{ fontSize: 17 }} />
                : <SearchIcon sx={{ fontSize: 18 }} />}
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
                fontFamily: "'Inter', sans-serif",
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
                fontFamily: "'Inter', sans-serif",
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

        {/* ── Avatar + overflow menu wrapper ── */}
        <Box sx={{ position: "relative", display: "flex", alignItems: "center", ml: 0.5, gap: 0.25 }}>

          {/* SK Avatar — click opens dropdown */}
          <Tooltip title="Sarah K." placement="bottom">
            <Avatar
              ref={avatarRef}
              onClick={() => setProfileOpen((p) => !p)}
              sx={{
                width: 32,
                height: 32,
                fontSize: 12,
                fontWeight: 700,
                backgroundColor: profileOpen ? "#163a25" : "#1a2a1a",
                color: profileOpen ? "#22c55e" : "#7ab0ff",
                border: profileOpen
                  ? "1.5px solid rgba(34,197,94,0.5)"
                  : "1.5px solid rgba(74,138,255,0.3)",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.03em",
                transition: "all 0.18s ease",
                "&:hover": {
                  border: "1.5px solid rgba(34,197,94,0.45)",
                  backgroundColor: "#163a25",
                  color: "#22c55e",
                },
              }}
            >
              SK
            </Avatar>
          </Tooltip>

          {/* ··· overflow button */}
          <IconButton
            size="small"
            onClick={() => setProfileOpen((p) => !p)}
            sx={{
              color: "#444",
              p: 0.4,
              "&:hover": { color: "#fff", backgroundColor: "transparent" },
            }}
          >
            <MoreHorizIcon sx={{ fontSize: 16 }} />
          </IconButton>

          {/* ── Dropdown ── */}
          <ProfileDropdown
            anchorEl={avatarRef.current}
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            onMenuClick={(label) => {
              if (label === "My profile") setProfilePageOpen(true);
            }}
          />
        </Box>
      </Box>
    </Box>

    {/* ── Profile Page Modal ── */}
    <ProfilePage
      open={profilePageOpen}
      onClose={() => setProfilePageOpen(false)}
    />
  </>
  );
}