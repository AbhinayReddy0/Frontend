import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  Paper,
  LinearProgress,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

export default function ManualUpload({ open, onClose }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setFile(null);
      setDone(false);
      setUploading(false);
      setDragOver(false);
    }
  }, [open]);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = [".csv", ".xlsx", ".xls"];
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) return;
    setFile(f);
    setDone(false);
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setDone(true);
    }, 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{ sx: { bgcolor: "#111", border: "none", borderRadius: 0 } }}
      BackdropProps={{ sx: { backdropFilter: "blur(8px)", bgcolor: "rgba(0,0,0,0.75)" } }}
    >
      <DialogContent sx={{ p: 0, height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ px: 3, pt: 3, pb: 2.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ width: 44, height: 44, bgcolor: "#1a1a1a", border: "1px dashed #333", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UploadFileIcon sx={{ color: "#888", fontSize: 20 }} />
            </Box>
            <Box>
              <Typography fontWeight={700} fontSize={16} color="#f5f5f5">Manual Upload</Typography>
              <Typography fontSize={12.5} color="#888" mt={0.3}>Upload inventory or order data</Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "#555", borderRadius: "8px", "&:hover": { color: "#ccc", bgcolor: "#1e1e1e" } }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "#222" }} />

        <Box sx={{ px: 3, pt: 2.5, pb: 3 }}>
          {/* Drop Zone */}
          <Paper
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && document.getElementById("modal-file-input").click()}
            sx={{
              bgcolor: dragOver ? "#1a2a1a" : "#0d0d0d",
              border: `2px dashed ${dragOver ? "#3a8a3a" : "#2a2a2a"}`,
              borderRadius: "14px",
              p: 5,
              textAlign: "center",
              cursor: uploading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              mb: 2.5,
              "&:hover": { bgcolor: "#141414", borderColor: "#3a3a3a" },
            }}
          >
            <input
              id="modal-file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <Box sx={{ width: 52, height: 52, bgcolor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
              <UploadFileIcon sx={{ fontSize: 24, color: "#666" }} />
            </Box>
            <Typography fontWeight={600} fontSize={14} color="#ccc" mb={0.6}>
              {dragOver ? "Drop your file here" : "Drag & drop your file here"}
            </Typography>
            <Typography fontSize={12.5} color="#555" mb={2}>
              Supports .csv, .xlsx, .xls files
            </Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: "#333", color: "#aaa", textTransform: "none",
                borderRadius: "8px", fontSize: 12.5, px: 2,
                "&:hover": { borderColor: "#666", color: "#eee", bgcolor: "#1a1a1a" },
              }}
            >
              Browse files
            </Button>
          </Paper>

          {/* File status */}
          {file && (
            <Box sx={{ bgcolor: "#0d0d0d", border: "1px solid #222", borderRadius: "12px", p: 2.5, mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: uploading ? 1.5 : 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 32, height: 32, bgcolor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <UploadFileIcon sx={{ fontSize: 15, color: "#777" }} />
                  </Box>
                  <Box>
                    <Typography fontSize={13} fontWeight={600} color="#ddd">{file.name}</Typography>
                    <Typography fontSize={11.5} color="#555">{(file.size / 1024).toFixed(1)} KB</Typography>
                  </Box>
                </Box>
                {done && (
                  <Chip
                    icon={<CheckCircleOutlineIcon sx={{ fontSize: "14px !important", color: "#4caf50 !important" }} />}
                    label="Uploaded"
                    size="small"
                    sx={{ bgcolor: "#0d1f0d", color: "#6aaa6a", border: "1px solid #1a3d1a", fontSize: 11.5, fontWeight: 600 }}
                  />
                )}
              </Box>
              {uploading && (
                <LinearProgress
                  sx={{
                    borderRadius: 2, bgcolor: "#222", height: 3,
                    "& .MuiLinearProgress-bar": { bgcolor: "#1a6eff", borderRadius: 2 },
                  }}
                />
              )}
            </Box>
          )}

          {/* Format hints */}
          {!file && (
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              {[".csv", ".xlsx", ".xls"].map((ext) => (
                <Box key={ext} sx={{ bgcolor: "#141414", border: "1px solid #222", borderRadius: "8px", px: 1.5, py: 0.6 }}>
                  <Typography fontSize={11.5} color="#666" fontWeight={600}>{ext}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {done ? (
              <>
                <Button
                  fullWidth
                  onClick={onClose}
                  sx={{ bgcolor: "#1246cc", color: "#fff", textTransform: "none", fontWeight: 600, fontSize: 13, borderRadius: "10px", py: 1.2, border: "1px solid #1a54e0", "&:hover": { bgcolor: "#0f3bb0" } }}
                >
                  Done
                </Button>
                <Button
                  fullWidth
                  onClick={() => { setFile(null); setDone(false); }}
                  sx={{ bgcolor: "transparent", color: "#aaa", textTransform: "none", fontWeight: 600, fontSize: 13, borderRadius: "10px", py: 1.2, border: "1px solid #2a2a2a", "&:hover": { bgcolor: "#1a1a1a", color: "#ddd" } }}
                >
                  Upload another
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                onClick={onClose}
                sx={{ bgcolor: "transparent", color: "#aaa", textTransform: "none", fontWeight: 600, fontSize: 13, borderRadius: "10px", py: 1.2, border: "1px solid #2a2a2a", "&:hover": { bgcolor: "#1a1a1a", color: "#ddd" } }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}