import { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CommandCenter from "./CommandCenter";
import DecisionReview from "./DecisionReview";
import ProductsPage from "./ProductsPage";

// Icons
import WorkOutlineIcon from "@mui/icons-material/WorkOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TuneIcon from "@mui/icons-material/Tune";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import InventoryIcon from "@mui/icons-material/Inventory";
import HistoryIcon from "@mui/icons-material/History";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import VerifiedIcon from "@mui/icons-material/Verified";
import ExtensionIcon from "@mui/icons-material/Extension";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TopBar from "./Topbar";
import POWorkspace from "./Poworkspace ";
import VendorsPage from "./VendorsPage";
import ReportsPage from "./Reportspage";
import Integrations from "./Integrations"
import ForecastingPage from "./Forecastingpage";
import DataTrustDashboard from "./Datatrustdashboard";
import ProfilePage, { SidebarProfileFooter } from "./ProfilePage";
import AuditLog from "./Auditlog";
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 64;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000000", paper: "#000000" },
    primary: { main: "#ffffff" },
    text: { primary: "#ffffff", secondary: "#888888" },
  },
  typography: {
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
  },
});

const NAV_ITEMS = [
  {
    id: "work",
    label: "Work",
    icon: <WorkOutlineIcon fontSize="small" />,
    children: [
      { id: "command-center", label: "Command Center", icon: <DashboardIcon fontSize="small" /> },
      { id: "decision-queue", label: "Decision Queue", icon: <AssignmentTurnedInIcon fontSize="small" /> },
      { id: "po-workspace", label: "PO Workspace", icon: <InventoryIcon fontSize="small" /> },
      { id: "audit-log", label: "Audit Log", icon: <HistoryIcon fontSize="small" /> },
    ],
  },
  {
    id: "catalog",
    label: "Catalog",
    icon: <MenuBookIcon fontSize="small" />,
    children: [
      { id: "vendors", label: "Vendors", icon: <StorefrontIcon fontSize="small" /> },
      { id: "products", label: "Products", icon: <CategoryIcon fontSize="small" /> },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    icon: <PsychologyIcon fontSize="small" />,
    children: [
      { id: "forecasting", label: "Forecasting", icon: <TrendingUpIcon fontSize="small" /> },
      { id: "reports", label: "Reports", icon: <BarChartIcon fontSize="small" /> },
      { id: "data-trust", label: "Data Trust", icon: <VerifiedIcon fontSize="small" /> },
    ],
  },
  {
    id: "config",
    label: "Config",
    icon: <TuneIcon fontSize="small" />,
    children: [
      { id: "integrations", label: "Integrations", icon: <ExtensionIcon fontSize="small" /> },
      { id: "settings", label: "Settings", icon: <SettingsIcon fontSize="small" /> },
    ],
  },
];

const accentColor = "#4a8aff";

// Custom sidebar toggle icon matching your screenshot
const SidebarToggleIcon = ({ flipped = false }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: flipped ? "scaleX(-1)" : "none", transition: "transform 0.25s ease" }}
  >
    <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.4" />
    <line x1="6" y1="1" x2="6" y2="17" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export default function AtheeraSidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({ work: true });
  const [activeItem, setActiveItem] = useState("command-center");
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleDrawer = () => setOpen((prev) => !prev);

  const toggleSection = (id) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sxNavParent = (id) => ({
    px: 1.5,
    py: 1,
    mx: 1,
    borderRadius: "8px",
    gap: 1,
    justifyContent: open ? "flex-start" : "center",
    color: expandedSections[id] ? "#ffffff" : "#666",
    transition: "all 0.18s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.07)",
      color: "#ffffff",
    },
    ...(open && expandedSections[id] && {
      backgroundColor: "rgba(74,138,255,0.07)",
      borderLeft: `2px solid ${accentColor}`,
      borderRadius: "0 8px 8px 0",
      ml: "12px",
      mr: 1,
      px: "10px",
    }),
  });

  const sxNavChild = (id) => ({
    pl: open ? 4 : 0,
    pr: open ? 1.5 : 0,
    py: 0.7,
    mx: 1,
    borderRadius: "7px",
    gap: 1,
    justifyContent: open ? "flex-start" : "center",
    transition: "all 0.15s ease",
    color: activeItem === id ? "#ffffff" : "#555",
    backgroundColor:
      activeItem === id
        ? "rgba(74,138,255,0.12)"
        : hoveredItem === id
          ? "rgba(255,255,255,0.05)"
          : "transparent",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.06)",
      color: "#ffffff",
    },
    ...(activeItem === id && { color: accentColor }),
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#080808",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "space-between" : "center",
              background: "rgba(255,255,255,0.05)",
              px: open ? 2 : 1,
              py: 2.2,
              minHeight: 64,
            }}
          >
            {open && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "6px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="https://atheera.ai/atheera-icon.png"
                    alt="Atheera"
                    style={{ width: 18, height: 18, objectFit: "contain" }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "0.04em",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Atheera
                </Typography>
              </Box>
            )}

            {/* Custom sidebar toggle icon button */}
            <Tooltip title={open ? "Collapse sidebar" : "Expand sidebar"} placement="right">
              <IconButton
                onClick={toggleDrawer}
                size="small"
                sx={{
                  color: "#555",
                  p: 0.8,
                  "&:hover": {
                    color: "#fff",
                    backgroundColor: "rgba(255,255,255,0.07)",
                  },
                }}
              >
                <SidebarToggleIcon flipped={open} />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: open ? 2 : 1 }} />

          {/* Nav List */}
          <List
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              mt: 1,
              pb: 2,
              scrollBehavior: "smooth",
            }}
          >
            {NAV_ITEMS.map((section) => (
              <Box key={section.id}>
                {/* Section header */}
                <Tooltip title={!open ? section.label : ""} placement="right">
                  <ListItemButton
                    onClick={() => {
                      if (!open) {
                        setOpen(true);
                        setExpandedSections((prev) => ({ ...prev, [section.id]: true }));
                      } else {
                        toggleSection(section.id);
                      }
                    }}
                    sx={sxNavParent(section.id)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        color: expandedSections[section.id] ? accentColor : "inherit",
                        transition: "color 0.15s",
                      }}
                    >
                      {section.icon}
                    </ListItemIcon>
                    {open && (
                      <>
                        <ListItemText
                          primary={section.label}
                          primaryTypographyProps={{
                            fontSize: 13,
                            fontWeight: 500,
                            letterSpacing: "0.02em",
                          }}
                        />
                        {expandedSections[section.id] ? (
                          <ExpandLessIcon sx={{ fontSize: 16, color: "#444" }} />
                        ) : (
                          <ExpandMoreIcon sx={{ fontSize: 16, color: "#444" }} />
                        )}
                      </>
                    )}
                  </ListItemButton>
                </Tooltip>

                {/* Children — only visible when sidebar is open */}
                <Collapse in={open && expandedSections[section.id]} timeout={200}>
                  <List disablePadding>
                    {section.children.map((child) => (
                      <ListItemButton
                        key={child.id}
                        onClick={() => setActiveItem(child.id)}
                        onMouseEnter={() => setHoveredItem(child.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        sx={sxNavChild(child.id)}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            color: activeItem === child.id ? accentColor : "#444",
                            transition: "color 0.15s",
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        {open && (
                          <ListItemText
                            primary={child.label}
                            primaryTypographyProps={{
                              fontSize: 12.5,
                              fontWeight: activeItem === child.id ? 500 : 400,
                              letterSpacing: "0.01em",
                            }}
                          />
                        )}
                        {open && activeItem === child.id && (
                          <Box
                            sx={{
                              width: 5,
                              height: 5,
                              borderRadius: "50%",
                              backgroundColor: accentColor,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ))}
          </List>

          {/* Footer — profile */}
          <SidebarProfileFooter open={open} onOpen={() => setProfileOpen(true)} />

          {/* Profile modal — rendered outside the sidebar so it overlays everything */}
          <ProfilePage open={profileOpen} onClose={() => setProfileOpen(false)} />
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <TopBar />
          {activeItem === "command-center" && <CommandCenter />}
          {activeItem === "decision-queue" && <DecisionReview onBack={null} />}
          {activeItem === "po-workspace" && <POWorkspace />}
          {activeItem === "products" && <ProductsPage />}
          {activeItem === "vendors" && <VendorsPage />}
          {activeItem === "reports" && <ReportsPage />}
          {activeItem === "integrations" && <Integrations />}
          {activeItem === "forecasting" && <ForecastingPage />}
          {activeItem === "data-trust" && <DataTrustDashboard />}
          {activeItem === "audit-log" && <AuditLog />}


        </Box>
      </Box>
    </ThemeProvider>
  );
}