import { useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Divider,
  Switch,
  Tooltip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import IntegrationInstructionsOutlinedIcon from "@mui/icons-material/IntegrationInstructionsOutlined";
import BillingIcon from "@mui/icons-material/CreditCardOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";

const accentColor = "#4a8aff";

const LabelText = ({ children }) => (
  <Typography
    sx={{
      fontSize: 10.5,
      fontWeight: 600,
      color: "#555",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      mb: 0.6,
    }}
  >
    {children}
  </Typography>
);

const FieldBox = ({ label, children, half = false }) => (
  <Box sx={{ width: half ? "calc(50% - 8px)" : "100%" }}>
    <LabelText>{label}</LabelText>
    {children}
  </Box>
);

const inputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: "8px",
    fontSize: 13,
    color: "#ddd",
    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused fieldset": { borderColor: accentColor, borderWidth: 1 },
  },
  "& input": { py: 1.1, px: 1.5 },
};

const selectSx = {
  backgroundColor: "rgba(255,255,255,0.04)",
  borderRadius: "8px",
  fontSize: 13,
  color: "#ddd",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: accentColor, borderWidth: 1 },
  "& .MuiSelect-select": { py: 1.1, px: 1.5 },
  "& .MuiSvgIcon-root": { color: "#555" },
};

// ─── Personal Tab ────────────────────────────────────────────────────────────
function PersonalTab({ avatarSrc, onAvatarChange, onRemoveAvatar, onOpenWorkspace }) {
  const fileRef = useRef();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#888", mb: 1.5, letterSpacing: "0.03em" }}>
          Profile photo
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={avatarSrc}
              sx={{
                width: 60,
                height: 60,
                bgcolor: "rgba(74,138,255,0.15)",
                fontSize: 20,
                fontWeight: 700,
                color: accentColor,
                border: "2px solid rgba(74,138,255,0.25)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              SK
            </Avatar>
            <Box
              onClick={() => fileRef.current.click()}
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0,
                cursor: "pointer",
                transition: "opacity 0.2s",
                "&:hover": { opacity: 1 },
              }}
            >
              <CameraAltOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />
            </Box>
          </Box>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) onAvatarChange(URL.createObjectURL(file));
            }}
          />
          <Box>
            <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
              <Box
                onClick={() => fileRef.current.click()}
                sx={{ fontSize: 12, color: accentColor, cursor: "pointer", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}
              >
                Upload photo
              </Box>
              {avatarSrc && (
                <>
                  <Typography sx={{ fontSize: 12, color: "#444" }}>·</Typography>
                  <Box
                    onClick={onRemoveAvatar}
                    sx={{ fontSize: 12, color: "#666", cursor: "pointer", "&:hover": { color: "#ff6b6b" } }}
                  >
                    Remove
                  </Box>
                </>
              )}
            </Box>
            <Typography sx={{ fontSize: 11, color: "#444" }}>
              JPG or PNG, max 5MB. Defaults to your initials if no photo uploaded.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

      <Box>
        <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#888", mb: 1.5, letterSpacing: "0.03em" }}>
          Personal details
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <FieldBox label="Full name" half>
            <TextField fullWidth defaultValue="Sarah Khan" sx={inputSx} size="small" />
          </FieldBox>
          <FieldBox label="Job title" half>
            <TextField fullWidth defaultValue="VP of Operations" sx={inputSx} size="small" />
          </FieldBox>
          <FieldBox label="Email" half>
            <TextField
              fullWidth
              defaultValue="sarah@acmeretail.com"
              sx={inputSx}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Chip
                      label="Verified"
                      size="small"
                      icon={<CheckCircleOutlinedIcon sx={{ fontSize: "13px !important", color: "#4caf50 !important" }} />}
                      sx={{
                        height: 20,
                        fontSize: 10,
                        fontWeight: 600,
                        bgcolor: "rgba(76,175,80,0.12)",
                        color: "#4caf50",
                        border: "1px solid rgba(76,175,80,0.25)",
                        "& .MuiChip-label": { px: 0.8 },
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </FieldBox>
          <FieldBox label="Phone (optional)" half>
            <TextField fullWidth defaultValue="+1 (555) 234-5678" sx={inputSx} size="small" />
          </FieldBox>
          <FieldBox label="Time zone" half>
            <FormControl fullWidth size="small">
              <Select defaultValue="pt" sx={selectSx}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#111", border: "1px solid rgba(255,255,255,0.08)", "& .MuiMenuItem-root": { fontSize: 13, color: "#ccc", "&:hover": { bgcolor: "rgba(255,255,255,0.06)" }, "&.Mui-selected": { bgcolor: "rgba(74,138,255,0.12)", color: "#fff" } } } } }}>
                <MenuItem value="pt">America / Los Angeles (PT)</MenuItem>
                <MenuItem value="et">America / New York (ET)</MenuItem>
                <MenuItem value="ct">America / Chicago (CT)</MenuItem>
                <MenuItem value="utc">UTC</MenuItem>
                <MenuItem value="ist">Asia / Kolkata (IST)</MenuItem>
              </Select>
            </FormControl>
          </FieldBox>
          <FieldBox label="Language" half>
            <FormControl fullWidth size="small">
              <Select defaultValue="en_us" sx={selectSx}
                MenuProps={{ PaperProps: { sx: { bgcolor: "#111", border: "1px solid rgba(255,255,255,0.08)", "& .MuiMenuItem-root": { fontSize: 13, color: "#ccc", "&:hover": { bgcolor: "rgba(255,255,255,0.06)" }, "&.Mui-selected": { bgcolor: "rgba(74,138,255,0.12)", color: "#fff" } } } } }}>
                <MenuItem value="en_us">English (US)</MenuItem>
                <MenuItem value="en_gb">English (UK)</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
              </Select>
            </FormControl>
          </FieldBox>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 0.5,
          p: 1.5,
          borderRadius: "8px",
          bgcolor: "rgba(74,138,255,0.05)",
          border: "1px solid rgba(74,138,255,0.12)",
        }}
      >
        <Typography sx={{ fontSize: 11.5, color: "#666", lineHeight: 1.6 }}>
          Looking for autonomy controls or recommendation preferences? Those live in{" "}
          <Box
            component="span"
            onClick={onOpenWorkspace}
            sx={{ color: accentColor, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
          >
            Workspace settings
          </Box>{" "}
          — they affect everyone on your team. This page is just for you.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box
          sx={{
            px: 2.5,
            py: 1,
            borderRadius: "8px",
            bgcolor: accentColor,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.15s",
            "&:hover": { opacity: 0.88 },
          }}
        >
          Save changes
        </Box>
      </Box>
    </Box>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const accentGreen = "#22c55e";
  const accentAmber = "#eab308";

  const eyeSx = { color: "#555", fontSize: 18, cursor: "pointer", "&:hover": { color: "#aaa" } };

  const recentSignIns = [
    { when: "Today, 8:42 AM", device: "Chrome on MacBook", location: "San Francisco, CA", ip: "73.158.42.xxx", result: "success" },
    { when: "Yesterday, 6:14 PM", device: "iOS app on iPhone", location: "San Francisco, CA", ip: "73.158.42.xxx", result: "success" },
    { when: "Mar 8, 2:31 AM", device: "Unknown device", location: "Lagos, Nigeria", ip: "102.89.34.xxx", result: "blocked" },
    { when: "Mar 6, 9:02 AM", device: "Edge on Windows", location: "Austin, TX", ip: "75.234.18.xxx", result: "success" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>

      {/* ── Password ── */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <LockOutlinedIcon sx={{ fontSize: 16, color: "#555" }} />
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#888", letterSpacing: "0.03em" }}>
            Change password
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <FieldBox label="Current password">
            <TextField
              fullWidth
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              sx={inputSx}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowCurrent((p) => !p)}>
                      {showCurrent ? <VisibilityOutlinedIcon sx={eyeSx} /> : <VisibilityOffOutlinedIcon sx={eyeSx} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FieldBox>
          <FieldBox label="New password">
            <TextField
              fullWidth
              type={showNew ? "text" : "password"}
              placeholder="Min. 8 characters"
              sx={inputSx}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowNew((p) => !p)}>
                      {showNew ? <VisibilityOutlinedIcon sx={eyeSx} /> : <VisibilityOffOutlinedIcon sx={eyeSx} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FieldBox>
          <FieldBox label="Confirm new password">
            <TextField
              fullWidth
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              sx={inputSx}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowConfirm((p) => !p)}>
                      {showConfirm ? <VisibilityOutlinedIcon sx={eyeSx} /> : <VisibilityOffOutlinedIcon sx={eyeSx} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FieldBox>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Box
              sx={{
                px: 2.5, py: 1, borderRadius: "8px",
                bgcolor: accentGreen, color: "#000",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                "&:hover": { opacity: 0.88 },
              }}
            >
              Update password
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

      {/* ── 2FA ── */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <ShieldOutlinedIcon sx={{ fontSize: 16, color: "#555" }} />
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#888", letterSpacing: "0.03em" }}>
            Two-factor authentication
          </Typography>
        </Box>
        {[
          { label: "Authenticator app", sub: "Use an app like Google Authenticator or Authy" },
          { label: "SMS / Text message", sub: "Send a code to your mobile phone" },
        ].map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              p: 1.5, mb: 1, borderRadius: "8px",
              bgcolor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 13, color: "#ccc", fontWeight: 500 }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 11.5, color: "#555" }}>{item.sub}</Typography>
            </Box>
            <Switch
              size="small"
              defaultChecked={i === 0}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: accentGreen },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: accentGreen },
              }}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

      {/* ── Active sessions ── */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <DevicesOutlinedIcon sx={{ fontSize: 16, color: "#555" }} />
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#888", letterSpacing: "0.03em" }}>
            Active sessions
          </Typography>
        </Box>
        {[
          { device: "Chrome on macOS", loc: "Los Angeles, CA", current: true },
          { device: "Safari on iPhone", loc: "Los Angeles, CA", current: false },
        ].map((s, i) => (
          <Box
            key={i}
            sx={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              p: 1.5, mb: 1, borderRadius: "8px",
              bgcolor: "rgba(255,255,255,0.03)",
              border: `1px solid ${s.current ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: 13, color: "#ccc", fontWeight: 500 }}>{s.device}</Typography>
                {s.current && (
                  <Chip
                    label="Current"
                    size="small"
                    sx={{
                      height: 18, fontSize: 9.5, fontWeight: 700,
                      bgcolor: "rgba(34,197,94,0.12)", color: accentGreen,
                      border: "1px solid rgba(34,197,94,0.2)",
                      "& .MuiChip-label": { px: 0.8 },
                    }}
                  />
                )}
              </Box>
              <Typography sx={{ fontSize: 11.5, color: "#555" }}>{s.loc}</Typography>
            </Box>
            {!s.current && (
              <Box sx={{ fontSize: 11.5, color: "#888", cursor: "pointer", fontWeight: 500, "&:hover": { color: "#ccc", textDecoration: "underline" } }}>
                Revoke
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

      {/* ── Recent sign-ins ── */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#888", letterSpacing: "0.03em" }}>
              Recent sign-ins
            </Typography>
          </Box>
          <Box
            sx={{
              fontSize: 11.5, color: accentGreen, cursor: "pointer", fontWeight: 500,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Export CSV
          </Box>
        </Box>
        <Typography sx={{ fontSize: 11.5, color: "#555", mb: 2 }}>
          Last 30 days · helps you spot suspicious activity
        </Typography>

        {/* Table header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.6fr 2fr 1.2fr 0.8fr",
            px: 1.5, pb: 1,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {["When", "Device & Location", "IP", "Result"].map((h) => (
            <Typography key={h} sx={{ fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {h}
            </Typography>
          ))}
        </Box>

        {/* Table rows */}
        {recentSignIns.map((row, i) => (
          <Box
            key={i}
            sx={{
              display: "grid",
              gridTemplateColumns: "1.6fr 2fr 1.2fr 0.8fr",
              alignItems: "center",
              px: 1.5, py: 1.2,
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
            }}
          >
            <Typography sx={{ fontSize: 12.5, color: "#bbb" }}>{row.when}</Typography>
            <Box>
              <Typography sx={{ fontSize: 12.5, color: "#bbb" }}>{row.device}</Typography>
              <Typography sx={{ fontSize: 11, color: "#555" }}>{row.location}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>{row.ip}</Typography>
            <Box>
              {row.result === "success" ? (
                <Chip
                  label="Success"
                  size="small"
                  sx={{
                    height: 20, fontSize: 10.5, fontWeight: 600,
                    bgcolor: "rgba(34,197,94,0.1)", color: accentGreen,
                    border: "1px solid rgba(34,197,94,0.2)",
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              ) : (
                <Chip
                  label="Blocked"
                  size="small"
                  sx={{
                    height: 20, fontSize: 10.5, fontWeight: 600,
                    bgcolor: "rgba(234,179,8,0.1)", color: accentAmber,
                    border: "1px solid rgba(234,179,8,0.2)",
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

      {/* ── Delete account ── */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <WarningAmberOutlinedIcon sx={{ fontSize: 16, color: accentAmber }} />
          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: accentAmber, letterSpacing: "0.03em" }}>
            Delete account
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5, borderRadius: "8px", mb: 1.5,
            bgcolor: "rgba(234,179,8,0.05)",
            border: "1px solid rgba(234,179,8,0.18)",
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
            Permanently deletes your account, profile, and all associated data. This action{" "}
            <Box component="span" sx={{ color: accentAmber, fontWeight: 600 }}>cannot be undone</Box>.
            Workspace data and shared resources will remain for other team members.
          </Typography>
        </Box>
        <Box
          onClick={() => setDeleteOpen(true)}
          sx={{
            display: "inline-flex", alignItems: "center", gap: 0.8,
            px: 2, py: 0.9, borderRadius: "8px",
            bgcolor: "rgba(234,179,8,0.08)",
            border: "1px solid rgba(234,179,8,0.22)",
            color: accentAmber,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "all 0.15s",
            "&:hover": { bgcolor: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.4)" },
          }}
        >
          <WarningAmberOutlinedIcon sx={{ fontSize: 15 }} />
          Delete my account
        </Box>
      </Box>

      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeleteConfirmText(""); }}
        PaperProps={{
          sx: {
            bgcolor: "#080808",
            backgroundImage: "none",
            border: "1px solid #1a1a1a",
            borderRadius: "18px",
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#fff", fontSize: 15, fontWeight: 700, pb: 1 }}>
          <WarningAmberOutlinedIcon sx={{ color: accentAmber, fontSize: 20 }} />
          Delete your account?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13, color: "#888", mb: 2, lineHeight: 1.6 }}>
            This will permanently delete your account and all personal data. Workspace resources remain.
            Type{" "}
            <Box component="span" sx={{ color: accentAmber, fontFamily: "monospace", fontWeight: 700 }}>
              DELETE
            </Box>{" "}
            to confirm.
          </Typography>
          <TextField
            fullWidth
            placeholder="Type DELETE to confirm"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            sx={inputSx}
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Box
            onClick={() => { setDeleteOpen(false); setDeleteConfirmText(""); }}
            sx={{
              px: 2, py: 0.9, borderRadius: "8px",
              bgcolor: "rgba(255,255,255,0.06)", color: "#aaa",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            Cancel
          </Box>
          <Box
            sx={{
              px: 2, py: 0.9, borderRadius: "8px",
              bgcolor: deleteConfirmText === "DELETE" ? "rgba(234,179,8,0.85)" : "rgba(100,100,100,0.2)",
              color: deleteConfirmText === "DELETE" ? "#000" : "#555",
              fontSize: 13, fontWeight: 700,
              cursor: deleteConfirmText === "DELETE" ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            Delete account
          </Box>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab() {
  const [channels, setChannels] = useState([
    { id: "atheera", icon: "🤖", label: "Atheera", sub: "Bell icon + browser push", priority: 1, enabled: true },
    { id: "email", icon: "✉️", label: "Email", sub: "sarah@acmeretail.com", priority: 2, enabled: true },
  ]);

  const [workingHours] = useState({
    weekdayStart: "8:00 AM",
    weekdayEnd: "6:00 PM",
    weekendEnabled: false,
    quietStart: "10:00 PM",
    quietEnd: "7:00 AM",
    allowCritical: true,
  });

  const notifGroups = [
    {
      label: "Purchase orders",
      items: [
        { title: "PO approved", sub: "When a PO gets approved by all approvers" },
        { title: "PO rejected", sub: "When a PO is rejected at any approval stage" },
        { title: "PO requires your action", sub: "When you're added as an approver" },
      ],
    },
    {
      label: "Inventory & forecasting",
      items: [
        { title: "Low stock alert", sub: "When a SKU drops below reorder threshold" },
        { title: "Reorder suggestion", sub: "When AI generates a new reorder recommendation" },
      ],
    },
    {
      label: "System",
      items: [
        { title: "Integration errors", sub: "When a connected integration fails to sync" },
        { title: "Weekly digest", sub: "Summary of activity every Monday morning" },
      ],
    },
  ];

  const channelCols = channels.filter((c) => c.id !== "sms");

  const toggleChannel = (id) => {
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Where to reach me */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#ccc", letterSpacing: "0.01em" }}>
              Where to reach me
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "#555", mt: 0.3 }}>
              Aria tries channels in this order. If you don't respond within 30 min, she tries the next.
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 11, color: "#444", mt: 0.4 }}>Drag to reorder priority</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {channels.map((ch, i) => (
            <Box
              key={ch.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: "8px",
                bgcolor: "rgba(255,255,255,0.03)",
                border: `1px solid ${ch.enabled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)"}`,
                opacity: ch.enabled ? 1 : 0.5,
                transition: "all 0.15s",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <DragIndicatorIcon sx={{ fontSize: 16, color: "#333", cursor: "grab" }} />
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    bgcolor: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  <img
                    src="https://atheera.ai/atheera-icon.png"
                    alt="Atheera"
                    style={{ width: 18, height: 18, objectFit: "contain" }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, color: "#ccc", fontWeight: 500 }}>{ch.label}</Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#555" }}>{ch.sub}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {ch.priority && (
                  <Chip
                    label={`Priority ${ch.priority}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 10,
                      fontWeight: 700,
                      bgcolor: "rgba(74,138,255,0.15)",
                      color: accentColor,
                      border: "1px solid rgba(74,138,255,0.2)",
                      "& .MuiChip-label": { px: 0.8 },
                    }}
                  />
                )}
                <Switch
                  size="small"
                  checked={ch.enabled}
                  onChange={() => toggleChannel(ch.id)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#4caf50" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#4caf50" },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

      {/* Working hours + Quiet hours */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Working hours */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRadius: "10px",
            bgcolor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#ccc", mb: 0.5 }}>Working hours</Typography>
          <Typography sx={{ fontSize: 11.5, color: "#555", mb: 2 }}>When you're available to approve recommendations.</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Typography sx={{ fontSize: 12, color: "#888", minWidth: 60 }}>Mon–Fri</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TimeChip label="8:00 AM" />
              <Typography sx={{ fontSize: 12, color: "#444" }}>→</Typography>
              <TimeChip label="6:00 PM" />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 12, color: "#888", minWidth: 60 }}>Sat–Sun</Typography>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                bgcolor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography sx={{ fontSize: 11.5, color: "#444" }}>— off —</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 2,
              p: 1.2,
              borderRadius: "7px",
              bgcolor: "rgba(0,0,0,0.3)",
            }}
          >
            <Typography sx={{ fontSize: 11, color: "#555", lineHeight: 1.6 }}>
              Outside these hours, Aria queues recommendations for your morning review unless flagged critical.
            </Typography>
          </Box>
        </Box>

        {/* Quiet hours */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            borderRadius: "10px",
            bgcolor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#ccc", mb: 0.5 }}>Quiet hours</Typography>
          <Typography sx={{ fontSize: 11.5, color: "#555", mb: 2 }}>Don't notify me except for critical alerts.</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: 12, color: "#888", minWidth: 40 }}>Daily</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TimeChip label="10:00 PM" />
              <Typography sx={{ fontSize: 12, color: "#444" }}>→</Typography>
              <TimeChip label="7:00 AM" />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontSize: 12, color: "#ccc", fontWeight: 500 }}>Allow critical alerts during quiet hours</Typography>
            <Switch
              size="small"
              defaultChecked
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#4caf50" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#4caf50" },
              }}
            />
          </Box>
          <Box
            sx={{
              p: 1.2,
              borderRadius: "7px",
              bgcolor: "rgba(0,0,0,0.3)",
            }}
          >
            <Typography sx={{ fontSize: 11, color: "#555", lineHeight: 1.6 }}>
              Critical = vendor SLA breach, sync failure, or recommendation above $5,000 threshold.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

      {/* Notification matrix */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 1, pr: 0.5 }}>
          {channelCols.map((c) => (
            <Box key={c.id} sx={{ width: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3 }}>
              <Typography sx={{ fontSize: 14 }}>{c.icon}</Typography>
              <Typography sx={{ fontSize: 10, color: "#555", fontWeight: 600, letterSpacing: "0.05em" }}>
                {c.label.toUpperCase()}
              </Typography>
            </Box>
          ))}
        </Box>
        {notifGroups.map((group, gi) => (
          <Box key={gi} sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.07em", textTransform: "uppercase", mb: 1, pl: 0.5 }}>
              {group.label}
            </Typography>
            {group.items.map((item, ii) => (
              <Box
                key={ii}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.2,
                  mb: 0.5,
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                }}
              >
                <Box sx={{ flex: 1, pr: 2 }}>
                  <Typography sx={{ fontSize: 13, color: "#ccc", fontWeight: 500 }}>{item.title}</Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#4a4a4a" }}>{item.sub}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {channelCols.map((c, ci) => (
                    <Box key={ci} sx={{ width: 64, display: "flex", justifyContent: "center" }}>
                      <Switch
                        size="small"
                        defaultChecked={ci === 0 || (ci === 1 && ii < 1)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": { color: accentColor },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: accentColor },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
            {gi < notifGroups.length - 1 && <Divider sx={{ borderColor: "rgba(255,255,255,0.04)", mt: 1 }} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── Time chip helper ─────────────────────────────────────────────────────────
function TimeChip({ label }) {
  return (
    <Box
      sx={{
        px: 1.2,
        py: 0.6,
        borderRadius: "7px",
        bgcolor: "rgba(74,138,255,0.1)",
        border: "1px solid rgba(74,138,255,0.2)",
      }}
    >
      <Typography sx={{ fontSize: 12, color: accentColor, fontWeight: 600 }}>{label}</Typography>
    </Box>
  );
}


// ─── Main ProfilePage Modal ───────────────────────────────────────────────────
export default function ProfilePage({ open, onClose }) {
  const [tab, setTab] = useState(0);
  const [avatarSrc, setAvatarSrc] = useState(null);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 1300,
          animation: "fadeIn 0.18s ease",
          "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
      />

      {/* Modal panel */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 640,
          maxWidth: "95vw",
          maxHeight: "88vh",
          bgcolor: "#0d0d0d",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          zIndex: 1400,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          animation: "slideUp 0.22s cubic-bezier(0.4,0,0.2,1)",
          "@keyframes slideUp": {
            from: { opacity: 0, transform: "translate(-50%, calc(-50% + 16px))" },
            to: { opacity: 1, transform: "translate(-50%, -50%)" },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            px: 3,
            pt: 2.5,
            pb: 1.5,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", fontFamily: "'DM Sans', sans-serif" }}>
              My profile
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "#555", mt: 0.3 }}>
              Personal settings · only affects you, not the workspace
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#444", mt: -0.5, "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.07)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: 3, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              minHeight: 40,
              "& .MuiTabs-indicator": { bgcolor: accentColor, height: 2, borderRadius: 1 },
              "& .MuiTab-root": {
                fontSize: 12.5,
                fontWeight: 500,
                color: "#555",
                minHeight: 40,
                px: 1.5,
                textTransform: "none",
                letterSpacing: "0.01em",
                fontFamily: "'DM Sans', sans-serif",
                "&.Mui-selected": { color: "#fff", fontWeight: 600 },
                "&:hover": { color: "#aaa" },
              },
            }}
          >
            <Tab label="Personal" />
            <Tab label="Security" />
            <Tab label="Notifications" />
          </Tabs>
        </Box>

        {/* Tab content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 2.5,
            "&::-webkit-scrollbar": { width: 5 },
            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255,255,255,0.1)", borderRadius: 3 },
          }}
        >
          {tab === 0 && (
            <PersonalTab
              avatarSrc={avatarSrc}
              onAvatarChange={setAvatarSrc}
              onRemoveAvatar={() => setAvatarSrc(null)}
              onOpenWorkspace={() => setWorkspaceOpen(true)}
            />
          )}
          {tab === 1 && <SecurityTab />}
          {tab === 2 && <NotificationsTab />}
        </Box>
      </Box>

    </>
  );
}

// ─── Sidebar Profile Footer ───────────────────────────────────────────────────
export function SidebarProfileFooter({ open: sidebarOpen, onOpen }) {
  return (
    <Tooltip title={!sidebarOpen ? "My profile" : ""} placement="right">
      <Box
        onClick={onOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: sidebarOpen ? 2 : 0,
          py: 1.5,
          justifyContent: sidebarOpen ? "flex-start" : "center",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          cursor: "pointer",
          transition: "background 0.15s",
          "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
        }}
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: "rgba(74,138,255,0.15)",
            fontSize: 11,
            fontWeight: 700,
            color: accentColor,
            border: "1.5px solid rgba(74,138,255,0.25)",
            flexShrink: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          SK
        </Avatar>
        {sidebarOpen && (
          <Box sx={{ overflow: "hidden" }}>
            <Typography noWrap sx={{ fontSize: 12.5, fontWeight: 600, color: "#ccc", lineHeight: 1.2, letterSpacing: "0.01em" }}>
              Sarah Khan
            </Typography>
            <Typography noWrap sx={{ fontSize: 11, color: "#444", lineHeight: 1.3 }}>
              sarah@acmeretail.com
            </Typography>
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}