import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
  Chip,
  LinearProgress,
  Paper,
  Tooltip
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GridViewIcon from "@mui/icons-material/GridView";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AssistantPage from "./Assistant";
import ManualUpload from "./ManualUpload";
import Sidebar from "./Sidebar";
// ─── MUI Theme ────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#000", paper: "#0a0a0a" },
    primary: { main: "#1a6eff" },
    text: { primary: "#fff", secondary: "#555" },
  },
  typography: { fontFamily: "'DM Sans', 'Inter', sans-serif" },
});

// ─── Field definitions per integration ───────────────────────────────────────

const NAV_ITEMS = [
  { id: "assistant", label: "AI Assistant", icon: <AutoAwesomeIcon sx={{ fontSize: 18 }} /> },
  { id: "integrations", label: "Integrations", icon: <GridViewIcon sx={{ fontSize: 18 }} /> },
];

const INTEGRATION_FIELDS = {
  Shopify: [
    { key: "storeUrl", label: "Store URL", placeholder: "yourstore.myshopify.com", type: "text" },
    { key: "apiKey", label: "API Key", placeholder: "shp_xxxxxxxxx", type: "password" },
  ],

  Amazon: [
    { key: "region", label: "Region", type: "select", options: ["North America", "Europe", "Far East"] },
    { key: "sellerId", label: "Seller ID", placeholder: "A1B2C3D4E5F6G7", type: "text" },
    { key: "apiKey", label: "API Key", placeholder: "amz_xxxxxxxxx", type: "password" },
  ],

  Walmart: [
    { key: "clientId", label: "Client ID", placeholder: "xxxxxxxx-xxxx", type: "text" },
    { key: "clientSecret", label: "Client Secret", placeholder: "••••••••", type: "password" },
  ],

  ShipBob: [
    { key: "apiToken", label: "API Token", placeholder: "sb_live_xxx", type: "password" },
  ],

  Xero: [
    { key: "orgId", label: "Organization ID", placeholder: "xero_org_xxx", type: "text" },
    { key: "apiKey", label: "API Key", placeholder: "xero_key_xxx", type: "password" },
  ],

  QuickBooks: [
    { key: "companyId", label: "Company ID", placeholder: "qb_company_xxx", type: "text" },
    { key: "apiKey", label: "API Key", placeholder: "qb_key_xxx", type: "password" },
  ],

  Cin7: [
    { key: "apiUsername", label: "API Username", placeholder: "cin7_api_user", type: "text" },
    { key: "apiKey", label: "API Key", placeholder: "••••••••", type: "password" },
  ],

  "Google Sheets": [
    { key: "sheetId", label: "Sheet ID", placeholder: "sheet_xxx", type: "text" },
    { key: "apiKey", label: "API Key", placeholder: "google_api_xxx", type: "password" },
  ],
};

const INTEGRATIONS = [
  { id: 1, name: "Shopify", desc: "Sync orders, products and inventory from your Shopify store in real time.", logo: "https://cdn.brandfetch.io/idAgPm7IvG/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1720758863442", connectUrl: "https://shopify.com" },
  { id: 2, name: "Amazon", desc: "Connect your Amazon Seller Central account for automated fulfillment.", logo: "https://cdn.brandfetch.io/idawOgYOsG/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1747149760643", connectUrl: "https://sellercentral.amazon.com" },
  { id: 3, name: "Walmart", desc: "Manage Walmart Marketplace listings, orders and returns seamlessly.", logo: "https://cdn.brandfetch.io/idoGsFQrHx/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1756891476083", connectUrl: "https://marketplace.walmart.com" },
  { id: 4, name: "ShipBob", desc: "Automate fulfillment, shipping logistics and warehouse management.", logo: "https://cdn.brandfetch.io/idkccMhoPZ/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1692720649718", connectUrl: "https://app.shipbob.com" },
  { id: 5, name: "Xero", desc: "Sync invoices, expenses and accounting data directly with Xero.", logo: "https://cdn.brandfetch.io/idvAAbnIRW/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667577419075", connectUrl: "https://xero.com" },
  { id: 6, name: "QuickBooks", desc: "Connect QuickBooks for seamless bookkeeping and financial reporting.", logo: "https://cdn.brandfetch.io/idYwh2MQCX/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1772986840240", connectUrl: "https://quickbooks.intuit.com" },
  { id: 7, name: "Cin7", desc: "End-to-end inventory and order management powered by Cin7.", logo: "https://cdn.brandfetch.io/idV9mVKQne/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1668014875407", connectUrl: "https://cin7.com" },
  { id: 8, name: "Google Sheets", desc: "Export, sync and collaborate on your data via Google Sheets.", logo: "https://cdn.brandfetch.io/id6O2oGzv-/theme/dark/idKa2XnbFY.svg?c=1bxid64Mup7aczewSAYMX&t=1755572735234", connectUrl: "https://sheets.google.com" },
];

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e8e8e8",
    bgcolor: "#0d0d0d",
    borderRadius: "10px",
    fontSize: 13,
    "& fieldset": { borderColor: "#2a2a2a" },
    "&:hover fieldset": { borderColor: "#3a3a3a" },
    "&.Mui-focused fieldset": { borderColor: "#1a6eff", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": { color: "#777", fontSize: 13 },
  "& .MuiInputLabel-root.Mui-focused": { color: "#1a6eff" },
  "& .MuiFormHelperText-root": { color: "#666", fontSize: 11, mt: 0.5 },
};

// ─── Connect Modal ────────────────────────────────────────────────────────────
const ConnectModal = ({ open, onClose, integration, onConnect }) => {
  const [formValues, setFormValues] = useState({});
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    if (open) { setFormValues({}); setShowPassword({}); }
  }, [open]);

  if (!integration) return null;

  const fields = INTEGRATION_FIELDS[integration.name] || [];
  const hasOAuthNotice = fields.some((f) => f.type === "oauth_notice");

  const handleChange = (key, value) => setFormValues((p) => ({ ...p, [key]: value }));
  const togglePassword = (key) => setShowPassword((p) => ({ ...p, [key]: !p[key] }));

  const handleConnect = () => {
    onConnect(integration.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#111",
          border: "1px solid #2a2a2a",
          borderRadius: "16px",
          width: 480,
          maxWidth: "95vw",
          boxShadow: "0 32px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,255,255,0.05)",
        },
      }}
      BackdropProps={{ sx: { backdropFilter: "blur(8px)", bgcolor: "rgba(0,0,0,0.75)" } }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ px: 3, pt: 3, pb: 2.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 48, height: 48, bgcolor: "#1a1a1a", border: "1px solid #2e2e2e", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", p: "10px", flexShrink: 0 }}>
              <Box component="img" src={integration.logo} alt={integration.name} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={16} color="#f5f5f5" letterSpacing="-0.2px">
                Connect {integration.name}
              </Typography>
              <Typography fontSize={12.5} color="#888" mt={0.3}>
                Securely link your account to Atheera
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#555", mt: -0.5, borderRadius: "8px", "&:hover": { color: "#ccc", bgcolor: "#1e1e1e" } }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "#222" }} />

        {/* Body */}
        <Box sx={{ px: 3, pt: 2.5, pb: 3 }}>
          {hasOAuthNotice && (
            <Box sx={{ display: "flex", gap: 2, bgcolor: "#0d1a30", border: "1px solid #1e3a6e", borderRadius: "12px", p: 2.5, mb: 3 }}>
              <Box sx={{ width: 36, height: 36, bgcolor: "#0c2050", border: "1px solid #1a3a80", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ShieldOutlinedIcon sx={{ color: "#5a9aff", fontSize: 18 }} />
              </Box>
              <Box>
                <Typography fontSize={13} fontWeight={600} color="#a8c8ff" mb={0.5}>
                  Secure OAuth2 Authentication
                </Typography>
                <Typography fontSize={12.5} color="#7aa0d0" lineHeight={1.7}>
                  {fields.find(f => f.type === "oauth_notice")?.message}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, mt: 1.5 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#3d9a3d" }} />
                  <Typography fontSize={11.5} color="#6aaa6a">No passwords stored on Atheera servers</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {fields.filter(f => f.type !== "oauth_notice").map((field) => {
            if (field.type === "select") return (
              <Box key={field.key} sx={{ mb: 2.5 }}>
                <Typography fontSize={12} color="#999" mb={1} fontWeight={600} letterSpacing="0.4px" textTransform="uppercase">
                  {field.label}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {field.options.map((opt) => (
                    <Chip
                      key={opt} label={opt} clickable
                      onClick={() => handleChange(field.key, opt)}
                      sx={{
                        borderRadius: "8px", border: "1px solid", fontSize: 12.5, height: 34,
                        borderColor: formValues[field.key] === opt ? "#1a4ecc" : "#2a2a2a",
                        bgcolor: formValues[field.key] === opt ? "rgba(26,78,204,0.18)" : "#181818",
                        color: formValues[field.key] === opt ? "#6aabff" : "#aaa",
                        fontWeight: formValues[field.key] === opt ? 600 : 400,
                        "&:hover": { bgcolor: "rgba(26,78,204,0.1)", borderColor: "#1a3a99" },
                        transition: "all 0.15s",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            );

            return (
              <TextField
                key={field.key} fullWidth label={field.label}
                placeholder={field.placeholder}
                type={field.type === "password" ? (showPassword[field.key] ? "text" : "password") : field.type}
                value={formValues[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                helperText={field.hint} size="small"
                sx={{ ...inputSx, mb: 2 }}
                InputProps={field.type === "password" ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => togglePassword(field.key)} sx={{ color: "#555", "&:hover": { color: "#ccc" } }} edge="end">
                        {showPassword[field.key] ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                } : undefined}
              />
            );
          })}

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 1, mb: 3 }}>
            <LockOutlinedIcon sx={{ fontSize: 11, color: "#444" }} />
            <Typography fontSize={11.5} color="#555" lineHeight={1.6}>
              Credentials are end-to-end encrypted and never stored in plain text.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button fullWidth onClick={onClose}
              sx={{ bgcolor: "transparent", color: "#aaa", textTransform: "none", fontWeight: 600, fontSize: 13, borderRadius: "10px", py: 1.2, border: "1px solid #2a2a2a", "&:hover": { bgcolor: "#1a1a1a", color: "#ddd", borderColor: "#3a3a3a" }, transition: "all 0.15s" }}>
              Cancel
            </Button>
            <Button fullWidth onClick={handleConnect}
              endIcon={hasOAuthNotice && <OpenInNewIcon sx={{ fontSize: "13px !important" }} />}
              sx={{ bgcolor: "#1246cc", color: "#fff", textTransform: "none", fontWeight: 600, fontSize: 13, borderRadius: "10px", py: 1.2, border: "1px solid #1a54e0", boxShadow: "0 2px 12px rgba(18,70,204,0.3)", "&:hover": { bgcolor: "#0f3bb0", boxShadow: "0 0 0 3px rgba(18,70,204,0.2), 0 2px 16px rgba(18,70,204,0.4)" }, transition: "all 0.2s" }}>
              {hasOAuthNotice ? `Continue to ${integration.name}` : "Connect"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// ─── Disconnect Modal ─────────────────────────────────────────────────────────
const DisconnectModal = ({ open, onClose, integration, onDisconnect }) => {
  if (!integration) return null;
  return (
    <Dialog open={open} onClose={onClose}
      PaperProps={{ sx: { bgcolor: "#111", border: "1px solid #2a2a2a", borderRadius: "16px", width: 420, maxWidth: "95vw", boxShadow: "0 32px 80px rgba(0,0,0,0.95)" } }}
      BackdropProps={{ sx: { backdropFilter: "blur(8px)", bgcolor: "rgba(0,0,0,0.75)" } }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 44, height: 44, bgcolor: "#1a1a1a", border: "1px solid #2e2e2e", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", p: "8px" }}>
              <Box component="img" src={integration.logo} alt={integration.name} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={15} color="#f0f0f0">Disconnect {integration.name}</Typography>
              <Typography fontSize={12} color="#666" mt={0.2}>Remove this integration</Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#555", borderRadius: "8px", "&:hover": { color: "#ccc", bgcolor: "#1e1e1e" } }}>
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "#222", mb: 2.5 }} />

        <Box sx={{ bgcolor: "#1a0a0a", border: "1px solid #3a1515", borderRadius: "12px", p: 2.5, mb: 3 }}>
          <Typography fontSize={13} color="#cc8888" lineHeight={1.75}>
            Disconnecting <strong style={{ color: "#e08080" }}>{integration.name}</strong> will stop all data syncing immediately. You can reconnect at any time from the Integrations page.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button fullWidth onClick={onClose}
            sx={{ bgcolor: "transparent", color: "#aaa", textTransform: "none", fontWeight: 600, fontSize: 13, borderRadius: "10px", py: 1.2, border: "1px solid #2a2a2a", "&:hover": { bgcolor: "#1a1a1a", color: "#ddd" }, transition: "all 0.15s" }}>
            Cancel
          </Button>
          <Button fullWidth onClick={() => { onDisconnect(integration.id); onClose(); }}
            sx={{ bgcolor: "#2a0808", color: "#e07070", textTransform: "none", fontWeight: 600, fontSize: 13, borderRadius: "10px", py: 1.2, border: "1px solid #4a1515", "&:hover": { bgcolor: "#3d0a0a", color: "#ff9090", boxShadow: "0 0 0 3px rgba(180,50,50,0.15)" }, transition: "all 0.2s" }}>
            Disconnect
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// ─── Integrations Page ────────────────────────────────────────────────────────
const IntegrationsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [connectedIds, setConnectedIds] = useState(new Set());

  const handleOpenConnect = (item) => { setSelectedIntegration(item); setModalOpen(true); };
  const handleOpenDisconnect = (item) => { setSelectedIntegration(item); setDisconnectOpen(true); };
  const handleConnect = (id) => setConnectedIds((p) => new Set([...p, id]));
  const handleDisconnect = (id) => setConnectedIds((p) => { const n = new Set(p); n.delete(id); return n; });

  const connectedCount = connectedIds.size;

  return (
    <Box sx={{ flex: 1, bgcolor: "#000", color: "#fff", p: 4, width: "100%", boxSizing: "border-box" }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" fontWeight={700} letterSpacing="-0.5px" color="#f0f0f0">Integrations</Typography>
            <Typography variant="body2" sx={{ color: "#666", mt: 0.5, fontSize: 13 }}>
              Connect your tools and platforms to streamline your workflow.
            </Typography>
          </Box>
          {connectedCount > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: "#071a07", border: "1px solid #0f330f", borderRadius: "10px", px: 2, py: 1 }}>
              <CheckCircleIcon sx={{ fontSize: 14, color: "#3d9a3d" }} />
              <Typography fontSize={12.5} color="#4aaa4a" fontWeight={600}>
                {connectedCount} connected
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* 3 cards per row grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
        {INTEGRATIONS.map((item) => {
          const connected = connectedIds.has(item.id);
          return (
            <Card key={item.id} sx={{
              bgcolor: connected ? "#050e05" : "#0c0c0c",
              border: `1px solid ${connected ? "#0f2e0f" : "#1e1e1e"}`,
              borderRadius: "14px", color: "#fff",
              display: "flex", flexDirection: "column",
              transition: "border-color 0.2s, transform 0.15s, box-shadow 0.2s",
              "&:hover": { borderColor: connected ? "#1a4a1a" : "#303030", transform: "translateY(-2px)", boxShadow: "0 4px 24px rgba(0,0,0,0.6)" },
            }}>
              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ width: 44, height: 44, bgcolor: "#161616", border: `1px solid ${connected ? "#1a3a1a" : "#242424"}`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", p: "8px" }}>
                    <Box component="img" src={item.logo} alt={item.name} sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                  </Box>
                  {connected && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, bgcolor: "#071a07", border: "1px solid #0d2e0d", borderRadius: "20px", px: 1.2, py: 0.4 }}>
                      <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#3d9a3d", boxShadow: "0 0 6px #3d9a3d" }} />
                      <Typography fontSize={10.5} color="#4aaa4a" fontWeight={600}>Active</Typography>
                    </Box>
                  )}
                </Box>
                <Typography fontWeight={600} fontSize={14.5} mb={0.6} color={connected ? "#c0efc0" : "#e8e8e8"} letterSpacing="-0.2px">
                  {item.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.65, fontSize: 12.5 }}>
                  {item.desc}
                </Typography>
              </CardContent>

              <Box sx={{ px: 2.5, pb: 2.5 }}>
                {connected ? (
                  <Button fullWidth onClick={() => handleOpenDisconnect(item)}
                    startIcon={<LinkOffIcon sx={{ fontSize: "14px !important" }} />}
                    sx={{ bgcolor: "#0d1a0d", color: "#5aaa5a", textTransform: "none", fontWeight: 600, fontSize: 12.5, borderRadius: "10px", py: 1, border: "1px solid #162816", "&:hover": { bgcolor: "#1a0d0d", color: "#e07070", borderColor: "#3a1010" }, transition: "all 0.2s" }}>
                    Disconnect
                  </Button>
                ) : (
                  <Button fullWidth onClick={() => handleOpenConnect(item)}
                    sx={{ bgcolor: "#0c1e3a", color: "#5a9aff", textTransform: "none", fontWeight: 600, fontSize: 12.5, borderRadius: "10px", py: 1, border: "1px solid #142e5a", "&:hover": { bgcolor: "#1246cc", color: "#fff", borderColor: "#1a54e0", boxShadow: "0 2px 12px rgba(18,70,204,0.3)" }, transition: "all 0.2s" }}>
                    Connect
                  </Button>
                )}
              </Box>
            </Card>
          );
        })}

        {/* Manual Upload Card */}
        <Card onClick={() => setUploadOpen(true)} sx={{ bgcolor: "#0c0c0c", border: "1px dashed #282828", borderRadius: "14px", color: "#fff", display: "flex", flexDirection: "column", transition: "border-color 0.2s, transform 0.15s", cursor: "pointer", "&:hover": { borderColor: "#444", transform: "translateY(-2px)" } }}>
          <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
            <Box sx={{ width: 44, height: 44, bgcolor: "#161616", border: "1px dashed #282828", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <UploadFileIcon sx={{ color: "#555", fontSize: 20 }} />
            </Box>
            <Typography fontWeight={600} fontSize={14.5} mb={0.6} color="#888" letterSpacing="-0.2px">Manual Upload</Typography>
            <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.65, fontSize: 12.5 }}>
              Upload your inventory or order data manually via CSV or Excel file.
            </Typography>
          </CardContent>
          <Box sx={{ px: 2.5, pb: 2.5 }}>
            <Button fullWidth onClick={(e) => { e.stopPropagation(); setUploadOpen(true); }}
              sx={{ bgcolor: "transparent", color: "#666", textTransform: "none", fontWeight: 600, fontSize: 12.5, borderRadius: "10px", py: 1, border: "1px solid #242424", "&:hover": { bgcolor: "#141414", borderColor: "#3a3a3a", color: "#aaa" }, transition: "all 0.2s" }}>
              Upload File
            </Button>
          </Box>
        </Card>
      </Box>

      <ConnectModal open={modalOpen} onClose={() => setModalOpen(false)} integration={selectedIntegration} onConnect={handleConnect} />
      <DisconnectModal open={disconnectOpen} onClose={() => setDisconnectOpen(false)} integration={selectedIntegration} onDisconnect={handleDisconnect} />
      <ManualUpload open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </Box>
  );
};

export default function App() {
  const [activePage, setActivePage] = useState("assistant");
  // ✅ Replace boolean with width number — never goes to 0
  const [sidebarWidth, setSidebarWidth] = useState(220);

  const isCollapsed = sidebarWidth <= 64;

  const handleToggle = () => {
    setSidebarWidth(isCollapsed ? 220 : 64);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", width: "100%", bgcolor: "#000", overflow: "hidden" }}>

        {/* ── Sliding Sidebar ── */}
        <Box
          sx={{
            width: sidebarWidth,
            minWidth: 64,              // ✅ Hard floor — never disappears
            flexShrink: 0,
            overflow: "hidden",
            transition: "width 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Box
            sx={{
              width: isCollapsed ? 64 : 220,  // ✅ Inner box also tracks
              height: "100vh",
              bgcolor: "#060606",
              borderRight: "1px solid #141414",
              display: "flex",
              flexDirection: "column",
              py: 2.5,
              transition: "width 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                gap: 1.5,
                px: isCollapsed ? 0 : 1.5,
                mx: isCollapsed ? "auto" : 0,
                mb: 3,
              }}
            >
              <Box sx={{ width: 32, height: 32, bgcolor: "#0c1e3a", border: "1px solid #142e5a", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src="https://atheera.ai/atheera-icon.png" alt="Atheera" style={{ width: 18, height: 18, objectFit: "contain" }} />
              </Box>
              {/* ✅ Only label hides */}
              {!isCollapsed && (
                <Typography fontWeight={800} fontSize={14} color="#e8e8e8" letterSpacing="-0.3px" lineHeight={1}>
                  Atheera
                </Typography>
              )}
            </Box>

            <Divider sx={{ borderColor: "#141414", mb: 2 }} />

            {/* Nav items */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1, px: 1 }}>
              {NAV_ITEMS.map((item) => {
                const active = activePage === item.id;
                return (
                  <Tooltip
                    key={item.id}
                    title={isCollapsed ? item.label : ""}
                    placement="right"
                    arrow
                  >
                    <Box
                      onClick={() => setActivePage(item.id)}
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
                        "&:hover": { bgcolor: active ? "#0c1e3a" : "#0e0e0e", color: active ? "#4a8aff" : "#888" },
                      }}
                    >
                      {/* ✅ Icon always rendered */}
                      <Box sx={{ color: "inherit", display: "flex", flexShrink: 0 }}>{item.icon}</Box>
                      {/* ✅ Label + arrow only when expanded */}
                      {!isCollapsed && (
                        <>
                          <Typography fontSize={13} fontWeight={active ? 600 : 500} color="inherit" letterSpacing="-0.1px" sx={{ whiteSpace: "nowrap" }}>
                            {item.label}
                          </Typography>
                          {active && <KeyboardArrowRightIcon sx={{ fontSize: 14, ml: "auto", opacity: 0.5 }} />}
                        </>
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>

            {/* Bottom – User */}
            <Divider sx={{ borderColor: "#141414", mb: 2 }} />
            <Box sx={{ display: "flex", justifyContent: isCollapsed ? "center" : "flex-start", px: isCollapsed ? 0 : 1.5 }}>
              <Tooltip title={isCollapsed ? "John Doe" : ""} placement="right" arrow>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {/* ✅ Avatar always visible */}
                  <Box sx={{ width: 28, height: 28, bgcolor: "#0c1e3a", border: "1px solid #142e5a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Typography fontSize={11} fontWeight={700} color="#4a8aff">JD</Typography>
                  </Box>
                  {!isCollapsed && (
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography fontSize={12} fontWeight={600} color="#666" noWrap>John Doe</Typography>
                      <Typography fontSize={10.5} color="#2a2a2a" noWrap>john@atheera.com</Typography>
                    </Box>
                  )}
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* ── Main content ── */}
        <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* ── Top bar ── */}
          <Box
            sx={{
              px: 2, py: 1.25,
              borderBottom: "1px solid #141414",
              bgcolor: "#060606",
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ width: 28, height: 28, bgcolor: "#0c1e3a", border: "1px solid #142e5a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="https://atheera.ai/atheera-icon.png" alt="Atheera" style={{ width: 16, height: 16, objectFit: "contain" }} />
              </Box>
              <Typography fontWeight={800} fontSize={14} color="#e8e8e8" letterSpacing="-0.3px">Atheera</Typography>
            </Box>

            {/* ✅ Toggle now switches between icon-only and expanded — never hides */}
            <IconButton
              onClick={handleToggle}
              size="small"
              sx={{
                color: !isCollapsed ? "#4a8aff" : "#555",
                borderRadius: "8px", p: "6px",
                transition: "color 0.2s, background 0.15s",
                "&:hover": { bgcolor: "#1a1a1a", color: "#aaa" },
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <line x1="6" y1="1" x2="6" y2="17" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </IconButton>
          </Box>

          {activePage === "assistant" && <AssistantPage />}
          {activePage === "integrations" && (
            <Box sx={{ flex: 1, height: "100%", overflowY: "auto" }}>
              <IntegrationsPage />
            </Box>
          )}
        </Box>

      </Box>
    </ThemeProvider>
  );
}