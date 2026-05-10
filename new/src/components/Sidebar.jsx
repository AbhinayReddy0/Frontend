// components/Sidebar.jsx
import { useRef, useEffect } from "react";
import {
  Box, Typography, IconButton, Divider, Tooltip
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GridViewIcon from "@mui/icons-material/GridView";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const NAV_ITEMS = [
  { id: "assistant", label: "AI Assistant", icon: <AutoAwesomeIcon sx={{ fontSize: 18 }} /> },
  { id: "integrations", label: "Integrations", icon: <GridViewIcon sx={{ fontSize: 18 }} /> },
];

const COLLAPSED_WIDTH = 64;   // icon-only width — never goes below this
const EXPANDED_WIDTH  = 240;

export default function Sidebar({
  activePage,
  onNavigate,
  sidebarWidth,
  setSidebarWidth,
  isResizing,
  setIsResizing,
}) {
  // ✅ Derived here — never rely on parent for this
  const isCollapsed = sidebarWidth <= COLLAPSED_WIDTH;

  /* ── resize drag ── */
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      // ✅ Minimum is COLLAPSED_WIDTH, never 0
      if (newWidth >= COLLAPSED_WIDTH && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, setSidebarWidth, setIsResizing]);

  const handleToggleCollapse = () => {
    // ✅ Collapsed → icon-only (64px), NOT hidden (0px)
    setSidebarWidth(isCollapsed ? EXPANDED_WIDTH : COLLAPSED_WIDTH);
  };

  return (
    <>
      <Box
        sx={{
          width: sidebarWidth,
          minWidth: COLLAPSED_WIDTH, // ✅ Hard floor — can never disappear
          flexShrink: 0,
          bgcolor: "#060606",
          borderRight: "1px solid #141414",
          display: "flex",
          flexDirection: "column",
          py: 2.5,
          transition: isResizing ? "none" : "width 0.25s ease",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* ── Logo ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: 1.5,
            px: isCollapsed ? 0 : 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 32, height: 32,
              bgcolor: "#0c1e3a",
              border: "1px solid #142e5a",
              borderRadius: "9px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <SmartToyOutlinedIcon sx={{ fontSize: 16, color: "#4a8aff" }} />
          </Box>

          {/* ✅ Only label hides — icon above always stays */}
          {!isCollapsed && (
            <Box>
              <Typography fontWeight={800} fontSize={14} color="#e8e8e8" letterSpacing="-0.3px" lineHeight={1}>
                Atheera
              </Typography>
              <Typography fontSize={10} color="#333" letterSpacing="0.5px" textTransform="uppercase">
                Operations
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "#141414", mb: 2 }} />

        {/* ── Nav items ── */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1, px: isCollapsed ? 1 : 1.5 }}>
          {NAV_ITEMS.map((item) => {
            const active = activePage === item.id;

            const navItem = (
              <Box
                key={item.id}
                onClick={() => onNavigate(item.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  gap: 1.5,
                  px: isCollapsed ? 0 : 1.5,
                  py: 1.2,
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  bgcolor: active ? "#0c1e3a" : "transparent",
                  border: `1px solid ${active ? "#142e5a" : "transparent"}`,
                  color: active ? "#4a8aff" : "#444",
                  "&:hover": {
                    bgcolor: active ? "#0c1e3a" : "#0e0e0e",
                    color: active ? "#4a8aff" : "#888",
                  },
                }}
              >
                {/* ✅ Icon always rendered */}
                <Box sx={{ color: "inherit", display: "flex", flexShrink: 0 }}>
                  {item.icon}
                </Box>

                {/* ✅ Only label + arrow hide */}
                {!isCollapsed && (
                  <>
                    <Typography
                      fontSize={13}
                      fontWeight={active ? 600 : 500}
                      color="inherit"
                      letterSpacing="-0.1px"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {item.label}
                    </Typography>
                    {active && (
                      <KeyboardArrowRightIcon sx={{ fontSize: 14, ml: "auto", opacity: 0.5 }} />
                    )}
                  </>
                )}
              </Box>
            );

            // ✅ Show label as tooltip when icon-only mode
            return isCollapsed ? (
              <Tooltip key={item.id} title={item.label} placement="right" arrow>
                {navItem}
              </Tooltip>
            ) : (
              <Box key={item.id}>{navItem}</Box>
            );
          })}
        </Box>

        <Divider sx={{ borderColor: "#141414", mb: 2 }} />

        {/* ── User ── */}
        <Box
          sx={{
            px: isCollapsed ? 0 : 1.5,
            display: "flex",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <Tooltip title={isCollapsed ? "John Doe" : ""} placement="right" arrow>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {/* ✅ Avatar always visible */}
              <Box
                sx={{
                  width: 28, height: 28,
                  bgcolor: "#0c1e3a",
                  border: "1px solid #142e5a",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography fontSize={11} fontWeight={700} color="#4a8aff">JD</Typography>
              </Box>
              {!isCollapsed && (
                <Box>
                  <Typography fontSize={12} fontWeight={600} color="#666" noWrap>John Doe</Typography>
                  <Typography fontSize={10.5} color="#2a2a2a" noWrap>john@atheera.com</Typography>
                </Box>
              )}
            </Box>
          </Tooltip>
        </Box>

        {/* ── Toggle chevron ── */}
        <IconButton
          onClick={handleToggleCollapse}
          size="small"
          sx={{
            position: "absolute",
            right: -10, top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "#0c0c0c",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            width: 20, height: 20,
            zIndex: 10,
            "&:hover": { bgcolor: "#1a1a1a", borderColor: "#3a3a3a" },
          }}
        >
          {isCollapsed
            ? <ChevronRightIcon sx={{ fontSize: 12 }} />
            : <ChevronLeftIcon sx={{ fontSize: 12 }} />
          }
        </IconButton>
      </Box>

      {/* Resize handle */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          width: "4px",
          cursor: "ew-resize",
          backgroundColor: isResizing ? "#1a6eff" : "transparent",
          transition: "background-color 0.2s",
          "&:hover": { backgroundColor: "#1a6eff" },
          flexShrink: 0,
          zIndex: 20,
        }}
      />
    </>
  );
}