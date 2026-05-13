import React, { useState, useRef, useEffect } from "react";
import {
    Box, Typography, Chip, Button, IconButton, Collapse,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Paper, Stack, Divider,
    ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import {
    Add, Edit, Check, Close,
    Email, Circle, KeyboardArrowDown,
} from "@mui/icons-material";

// ─── DATA ────────────────────────────────────────────────────────────────────

const initialVendors = [
    {
        id: "VA", name: "Vendor A",
        email: "purchasing@vendora.com", cc: "Sarah",
        pos: [
            {
                id: "PO-2034", status: "draft", delivery: "Mar 14",
                skus: [
                    { sku: "CT-NAVY-L", name: "Cotton tee navy L", qty: 240, unit: 8.0, total: 1920, delivery: "Mar 14" },
                    { sku: "CT-NAVY-M", name: "Cotton tee navy M", qty: 160, unit: 8.0, total: 1280, delivery: "Mar 14" },
                    { sku: "BN-CRM-OS", name: "Beanie cream OS", qty: 80, unit: 8.0, total: 640, delivery: "Mar 16" },
                ],
            },
            {
                id: "PO-2032", status: "approved", delivery: "Mar 15",
                skus: [
                    { sku: "CT-WHT-S", name: "Cotton tee white S", qty: 100, unit: 7.0, total: 700, delivery: "Mar 15" },
                    { sku: "CT-WHT-M", name: "Cotton tee white M", qty: 200, unit: 7.0, total: 1400, delivery: "Mar 15" },
                    { sku: "CT-BLK-L", name: "Cotton tee black L", qty: 100, unit: 7.0, total: 700, delivery: "Mar 15" },
                ],
            },
            {
                id: "PO-2028", status: "acknowledged", delivery: "Mar 14",
                skus: [
                    { sku: "HD-GRY-M", name: "Hoodie grey M", qty: 60, unit: 30, total: 1800, delivery: "Mar 14" },
                ],
            },
        ],
    },
    {
        id: "VB", name: "Vendor B",
        email: "orders@vendorb.com", cc: "Mike",
        pos: [
            {
                id: "PO-2031", status: "sent", delivery: "Mar 11",
                skus: [
                    { sku: "CP-RED-OS", name: "Cap red OS", qty: 50, unit: 12, total: 600, delivery: "Mar 11" },
                    { sku: "CP-BLU-OS", name: "Cap blue OS", qty: 50, unit: 12, total: 600, delivery: "Mar 11" },
                    { sku: "SCF-BLK", name: "Scarf black", qty: 20, unit: 10, total: 200, delivery: "Mar 13" },
                ],
            },
        ],
    },
    {
        id: "VC", name: "Vendor C",
        email: "supply@vendorc.com", cc: "Lee",
        pos: [
            {
                id: "PO-2033", status: "draft", delivery: "Mar 17",
                skus: [
                    { sku: "JKT-BLK-M", name: "Jacket black M", qty: 30, unit: 70, total: 2100, delivery: "Mar 17" },
                    { sku: "JKT-BLK-L", name: "Jacket black L", qty: 30, unit: 70, total: 2100, delivery: "Mar 17" },
                ],
            },
        ],
    },
];

const suggestedSkus = [
    { sku: "CT-BLK-S", name: "Cotton tee black S", defaultQty: 100, unit: 8.0 },
    { sku: "CT-BLK-M", name: "Cotton tee black M", defaultQty: 120, unit: 8.0 },
    { sku: "HD-BLK-L", name: "Hoodie black L", defaultQty: 50, unit: 32.0 },
    { sku: "CP-WHT-OS", name: "Cap white OS", defaultQty: 80, unit: 12.0 },
    { sku: "SCF-WHT", name: "Scarf white", defaultQty: 40, unit: 10.0 },
    { sku: "JKT-GRY-M", name: "Jacket grey M", defaultQty: 20, unit: 70.0 },
];

const recentActivities = [
    { time: "2h ago", text: "Vendor A acknowledged PO-2028" },
    { time: "5h ago", text: "Aria chased Vendor B on PO-2031", alert: true, alertTitle: "Vendor B late", alertBody: "PO-2031 promised Mar 11. Aria sent reminder 2x." },
    { time: "8h ago", text: "Aria drafted PO-2034 from approved decision" },
    { time: "1d ago", text: "You approved PO-2032" },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS = {
    draft: { label: "Draft", color: "#f5c842", bg: "rgba(245,200,66,0.08)", border: "rgba(245,200,66,0.25)" },
    approved: { label: "Approved", color: "#42b0f5", bg: "rgba(66,176,245,0.08)", border: "rgba(66,176,245,0.25)" },
    sent: { label: "Sent 2d ago", color: "#d966ff", bg: "rgba(217,102,255,0.08)", border: "rgba(217,102,255,0.25)" },
    acknowledged: { label: "Acknowledged", color: "#4dff88", bg: "rgba(77,255,136,0.08)", border: "rgba(77,255,136,0.25)" },
};

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────

const T = {
    bg: "#0a0a0a",
    surface: "#111111",
    surface2: "#161616",
    border: "#1e1e1e",
    border2: "#2a2a2a",
    muted: "#444444",
    subtle: "#666666",
    dim: "#999999",
    text: "#dddddd",
    white: "#ffffff",
    mono: "'JetBrains Mono', monospace",
    fs: { xs: 10, sm: 11, base: 13, md: 14, lg: 16, xl: 20, h1: 18 },
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function StatusChip({ status }) {
    const s = STATUS[status] || STATUS.draft;
    return (
        <Chip
            icon={<Circle sx={{ fontSize: "6px !important", color: `${s.color} !important` }} />}
            label={s.label}
            size="small"
            sx={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                color: s.color,
                fontFamily: "'Inter', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.04em",
                height: 24,
                "& .MuiChip-icon": { ml: "8px" },
            }}
        />
    );
}

// ─── UNIFIED FILTER DROPDOWN ──────────────────────────────────────────────────

function UnifiedFilterDropdown({ vendors, value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // value shape: { type: "all" } | { type: "vendor", id } | { type: "product", sku }
    const isActive = value.type !== "all";

    // Build label
    let label = "All vendors & products";
    if (value.type === "vendor") {
        label = vendors.find(v => v.id === value.id)?.name || "Vendor";
    } else if (value.type === "product") {
        const allSkus = vendors.flatMap(v => v.pos.flatMap(p => p.skus));
        label = allSkus.find(s => s.sku === value.sku)?.name || value.sku;
    }

    // Unique SKUs
    const allSkuMap = new Map();
    vendors.forEach(v => v.pos.forEach(p => p.skus.forEach(s => {
        if (!allSkuMap.has(s.sku)) allSkuMap.set(s.sku, { sku: s.sku, name: s.name });
    })));
    const allSkus = Array.from(allSkuMap.values());

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const select = (val) => { onChange(val); setOpen(false); };

    return (
        <Box ref={ref} sx={{ position: "relative" }}>
            {/* Trigger button */}
            <Box
                onClick={() => setOpen(p => !p)}
                sx={{
                    display: "flex", alignItems: "center", gap: 0.75,
                    background: isActive ? T.surface2 : "transparent",
                    border: `1px solid ${isActive ? "#555" : T.border2}`,
                    borderRadius: "20px",
                    color: isActive ? T.white : T.subtle,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 11,
                    px: 1.75, py: "5px",
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.15s",
                    "&:hover": { borderColor: "#555", color: T.text },
                    minWidth: 180,
                    maxWidth: 240,
                }}
            >
                <Typography noWrap sx={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "inherit", flex: 1 }}>
                    {label}
                </Typography>
                <KeyboardArrowDown sx={{
                    fontSize: 14, color: T.subtle, flexShrink: 0,
                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                }} />
            </Box>

            {/* Dropdown panel */}
            {open && (
                <Box sx={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0,
                    width: 240, background: "#141414",
                    border: `1px solid ${T.border2}`, borderRadius: 2,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
                    zIndex: 1000, overflow: "hidden",
                    animation: "dropIn 0.15s ease",
                    "@keyframes dropIn": {
                        from: { opacity: 0, transform: "translateY(-4px)" },
                        to: { opacity: 1, transform: "translateY(0)" },
                    },
                }}>
                    {/* All option */}
                    <Box
                        onClick={() => select({ type: "all" })}
                        sx={{
                            px: 2, py: 1.25, cursor: "pointer", fontSize: 12,
                            fontFamily: "'Inter', sans-serif",
                            color: value.type === "all" ? T.white : T.dim,
                            background: value.type === "all" ? "rgba(255,255,255,0.05)" : "transparent",
                            "&:hover": { background: "rgba(255,255,255,0.04)", color: T.white },
                            borderBottom: `1px solid ${T.border}`,
                        }}
                    >
                        All vendors & products
                    </Box>

                    {/* Vendors section */}
                    <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                        <Typography sx={{ fontSize: 9, fontFamily: "'Inter', sans-serif", color: T.muted, letterSpacing: "0.1em", mb: 0.75 }}>
                            VENDORS
                        </Typography>
                    </Box>
                    {vendors.map(v => (
                        <Box
                            key={v.id}
                            onClick={() => select({ type: "vendor", id: v.id })}
                            sx={{
                                px: 2, py: 1, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                background: value.type === "vendor" && value.id === v.id ? "rgba(255,255,255,0.05)" : "transparent",
                                "&:hover": { background: "rgba(255,255,255,0.04)" },
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{
                                    width: 20, height: 20, borderRadius: 0.75,
                                    background: T.surface2, border: `1px solid ${T.border2}`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 8, color: T.subtle, fontWeight: 700 }}>{v.id}</Typography>
                                </Box>
                                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: T.text }}>{v.name}</Typography>
                            </Box>
                            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: T.muted }}>
                                {v.pos.length} POs
                            </Typography>
                        </Box>
                    ))}

                    {/* Divider */}
                    <Box sx={{ borderTop: `1px solid ${T.border}`, my: 1 }} />

                    {/* Products section */}
                    <Box sx={{ px: 2, pb: 0.5 }}>
                        <Typography sx={{ fontSize: 9, fontFamily: "'Inter', sans-serif", color: T.muted, letterSpacing: "0.1em", mb: 0.75 }}>
                            PRODUCTS
                        </Typography>
                    </Box>
                    <Box sx={{
                        maxHeight: 180, overflowY: "auto", pb: 1,
                        "&::-webkit-scrollbar": { width: 4 },
                        "&::-webkit-scrollbar-track": { background: "transparent" },
                        "&::-webkit-scrollbar-thumb": { background: T.border2, borderRadius: 2 },
                    }}>
                        {allSkus.map(s => (
                            <Box
                                key={s.sku}
                                onClick={() => select({ type: "product", sku: s.sku })}
                                sx={{
                                    px: 2, py: 0.875, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    background: value.type === "product" && value.sku === s.sku ? "rgba(255,255,255,0.05)" : "transparent",
                                    "&:hover": { background: "rgba(255,255,255,0.04)" },
                                }}
                            >
                                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: T.text }}>{s.name}</Typography>
                                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: T.muted, ml: 1 }}>{s.sku}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

// ─── PRODUCT VIEW ─────────────────────────────────────────────────────────────

function ProductView({ sku, vendors }) {
    // Find all vendors that have this SKU in any PO
    const vendorRows = vendors.flatMap(v => {
        const matchingPos = v.pos.filter(p => p.skus.some(s => s.sku === sku));
        return matchingPos.flatMap(p => {
            const skuRow = p.skus.find(s => s.sku === sku);
            if (!skuRow) return [];
            return [{ vendor: v, po: p, skuRow }];
        });
    });

    if (vendorRows.length === 0) {
        return (
            <Box sx={{ textAlign: "center", py: 10, color: T.border2, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                No vendors carry this product
            </Box>
        );
    }

    const totalQty = vendorRows.reduce((s, r) => s + r.skuRow.qty, 0);
    const totalVal = vendorRows.reduce((s, r) => s + r.skuRow.total, 0);
    const skuName = vendorRows[0].skuRow.name;

    return (
        <Box>
            {/* Product summary header */}
            <Paper elevation={0} sx={{ background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 2, p: 2.5, mb: 2 }}>
                <Typography sx={{ fontSize: T.fs.md, fontWeight: 700, color: T.white, mb: 0.5 }}>{skuName}</Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: T.muted, mb: 2 }}>{sku}</Typography>
                <Stack direction="row" spacing={3}>
                    <Box>
                        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: T.muted, letterSpacing: "0.08em", mb: 0.25 }}>TOTAL QTY</Typography>
                        <Typography sx={{ fontSize: 18, fontWeight: 700, color: T.white }}>{totalQty.toLocaleString()}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: T.muted, letterSpacing: "0.08em", mb: 0.25 }}>TOTAL VALUE</Typography>
                        <Typography sx={{ fontSize: 18, fontWeight: 700, color: T.white }}>${totalVal.toLocaleString()}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: T.muted, letterSpacing: "0.08em", mb: 0.25 }}>VENDORS</Typography>
                        <Typography sx={{ fontSize: 18, fontWeight: 700, color: T.white }}>{new Set(vendorRows.map(r => r.vendor.id)).size}</Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Per-vendor breakdown */}
            <Stack spacing={1.25}>
                {vendorRows.map(({ vendor, po, skuRow }, i) => (
                    <Paper key={i} elevation={0} sx={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, overflow: "hidden" }}>
                        {/* Vendor + PO header */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.75 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Box sx={{ width: 34, height: 34, borderRadius: 1.5, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: T.subtle, fontWeight: 600 }}>{vendor.id}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: T.fs.md, fontWeight: 600, color: T.white }}>
                                        {vendor.name} · <span style={{ color: T.subtle, fontWeight: 400 }}>{po.id}</span>
                                    </Typography>
                                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: T.fs.xs, color: T.muted, mt: 0.25 }}>
                                        {vendor.email}
                                    </Typography>
                                </Box>
                            </Stack>
                            <StatusChip status={po.status} />
                        </Box>

                        {/* SKU detail row */}
                        <Box sx={{ borderTop: `1px solid ${T.border}` }}>
                            {/* Column headers */}
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 80px 90px 90px 90px", gap: 1, px: 2.5, py: 1, borderBottom: `1px solid #1a1a1a` }}>
                                {["SKU", "QTY", "UNIT", "TOTAL", "DELIVERY"].map((h, i) => (
                                    <Typography key={i} sx={{ fontSize: T.fs.xs, fontFamily: "'Inter', sans-serif", color: T.muted, letterSpacing: "0.06em" }}>{h}</Typography>
                                ))}
                            </Box>
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 80px 90px 90px 90px", gap: 1, px: 2.5, py: 1.5 }}>
                                <Box>
                                    <Typography sx={{ fontSize: T.fs.base, color: T.text, fontWeight: 500 }}>{skuRow.name}</Typography>
                                    <Typography sx={{ fontSize: 10, color: T.muted, fontFamily: "'Inter', sans-serif", mt: 0.2 }}>{skuRow.sku}</Typography>
                                </Box>
                                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: T.text }}>{skuRow.qty}</Typography>
                                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: T.text }}>${skuRow.unit.toFixed(2)}</Typography>
                                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: T.text }}>${skuRow.total.toLocaleString()}</Typography>
                                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: T.subtle }}>{skuRow.delivery}</Typography>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
}

// ─── ADD SKU MODAL ────────────────────────────────────────────────────────────

function AddSkuModal({ open, vendorName, onClose, onAdd }) {
    const [mode, setMode] = useState("suggested");
    const [selected, setSelected] = useState(null);
    const [qty, setQty] = useState("");
    const [unit, setUnit] = useState("");
    const [delivery, setDelivery] = useState("Mar 18");
    const [custom, setCustom] = useState({ sku: "", name: "", qty: "", unit: "" });

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            background: T.surface,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: T.white,
            "& fieldset": { borderColor: T.border2 },
            "&:hover fieldset": { borderColor: "#444" },
            "&.Mui-focused fieldset": { borderColor: "#555" },
        },
        "& .MuiInputLabel-root": { color: T.muted, fontFamily: "'Inter', sans-serif", fontSize: 12 },
        "& .MuiInputLabel-root.Mui-focused": { color: "#aaa" },
    };

    const handleAdd = () => {
        if (mode === "suggested" && selected !== null) {
            const s = suggestedSkus[selected];
            const q = parseInt(qty) || s.defaultQty;
            const u = parseFloat(unit) || s.unit;
            onAdd({ sku: s.sku, name: s.name, qty: q, unit: u, total: q * u, delivery });
        } else if (mode === "custom") {
            const q = parseInt(custom.qty) || 0;
            const u = parseFloat(custom.unit) || 0;
            onAdd({ sku: custom.sku, name: custom.name, qty: q, unit: u, total: q * u, delivery });
        }
        setSelected(null); setQty(""); setUnit(""); setCustom({ sku: "", name: "", qty: "", unit: "" });
    };

    const canAdd = mode === "suggested" ? selected !== null : custom.sku && custom.name;

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{
            sx: { background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 2, minWidth: 480, color: T.white },
        }}>
            <DialogTitle sx={{ pb: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: T.white }}>
                    Add SKU — {vendorName}
                </Typography>
                <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: T.subtle, mt: 0.5 }}>
                    Choose from suggestions or enter manually
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ position: "absolute", top: 12, right: 12, color: T.subtle }}>
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: "8px !important" }}>
                <ToggleButtonGroup value={mode} exclusive onChange={(_, v) => v && setMode(v)} fullWidth size="small"
                    sx={{ mb: 2, "& .MuiToggleButton-root": { borderColor: T.border2, color: T.subtle, fontFamily: "'Inter', sans-serif", fontSize: 11, textTransform: "none", "&.Mui-selected": { background: T.surface2, color: T.white, borderColor: "#555" } } }}>
                    <ToggleButton value="suggested">Suggested SKUs</ToggleButton>
                    <ToggleButton value="custom">Manual Entry</ToggleButton>
                </ToggleButtonGroup>

                {mode === "suggested" ? (
                    <Stack spacing={0.75} sx={{ mb: 2 }}>
                        {suggestedSkus.map((s, i) => (
                            <Box key={i} onClick={() => { setSelected(i); setQty(String(s.defaultQty)); setUnit(String(s.unit)); }}
                                sx={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    px: 1.5, py: 1.25, borderRadius: 1.5, cursor: "pointer",
                                    border: `1px solid ${selected === i ? "#555" : T.border}`,
                                    background: selected === i ? T.surface2 : "transparent",
                                    transition: "all 0.15s",
                                    "&:hover": { borderColor: "#444", background: T.surface2 },
                                }}>
                                <Box>
                                    <Typography sx={{ fontSize: 12, color: T.text }}>{s.name}</Typography>
                                    <Typography sx={{ fontSize: 10, color: T.muted, fontFamily: "'Inter', sans-serif" }}>{s.sku}</Typography>
                                </Box>
                                <Typography sx={{ fontSize: 11, color: T.subtle, fontFamily: "'Inter', sans-serif" }}>
                                    ${s.unit.toFixed(2)}/unit
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <Grid container spacing={1.5} sx={{ mb: 2 }}>
                        {[["SKU Code", "sku"], ["Product Name", "name"], ["Quantity", "qty"], ["Unit Price ($)", "unit"]].map(([label, field]) => (
                            <Grid item xs={field === "sku" || field === "name" ? 12 : 6} key={field}>
                                <TextField fullWidth size="small" label={label} value={custom[field]}
                                    onChange={e => setCustom(p => ({ ...p, [field]: e.target.value }))} sx={inputSx} />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {selected !== null && mode === "suggested" && (
                    <Grid container spacing={1.5} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <TextField fullWidth size="small" label="Quantity" value={qty} onChange={e => setQty(e.target.value)} sx={inputSx} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth size="small" label="Unit Price ($)" value={unit} onChange={e => setUnit(e.target.value)} sx={inputSx} />
                        </Grid>
                    </Grid>
                )}

                {(selected !== null || mode === "custom") && (
                    <TextField fullWidth size="small" label="Delivery Date" value={delivery}
                        onChange={e => setDelivery(e.target.value)} sx={inputSx} />
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                <Button onClick={onClose} size="small" sx={{ color: T.subtle, border: `1px solid ${T.border2}`, borderRadius: 1.5, textTransform: "none", px: 2 }}>
                    Cancel
                </Button>
                <Button onClick={handleAdd} disabled={!canAdd} variant="contained" size="small"
                    sx={{ background: canAdd ? T.white : "#222", color: canAdd ? "#000" : T.muted, fontWeight: 700, textTransform: "none", borderRadius: 1.5, px: 2.5, "&:hover": { background: "#e0e0e0" }, "&.Mui-disabled": { background: "#222", color: T.muted } }}>
                    Add SKU
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── SKU ROW ──────────────────────────────────────────────────────────────────

function SkuRow({ sku, onEdit }) {
    const [editing, setEditing] = useState(false);
    const [vals, setVals] = useState({ qty: sku.qty, unit: sku.unit });

    const save = () => {
        const q = parseInt(vals.qty) || 0, u = parseFloat(vals.unit) || 0;
        onEdit({ qty: q, unit: u, total: q * u });
        setEditing(false);
    };

    const cellSx = { fontFamily: "'Inter', sans-serif", fontSize: 12, color: T.text };
    const inputSx = {
        "& .MuiOutlinedInput-root": {
            background: "#1a1a1a", fontFamily: "'Inter', sans-serif", fontSize: 11, color: T.white,
            height: 30,
            "& fieldset": { borderColor: "#333" },
            "&.Mui-focused fieldset": { borderColor: "#555" },
        },
    };

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 80px 90px 90px 90px 90px", gap: 1, alignItems: "center", py: 1.25, borderBottom: `1px solid #161616` }}>
            <Box>
                <Typography sx={{ fontSize: T.fs.base, color: T.text, fontWeight: 500 }}>{sku.name}</Typography>
                <Typography sx={{ fontSize: 10, color: T.muted, fontFamily: "'Inter', sans-serif", mt: 0.2 }}>{sku.sku}</Typography>
            </Box>

            {editing ? (
                <>
                    <TextField size="small" value={vals.qty} onChange={e => setVals(p => ({ ...p, qty: e.target.value }))} sx={inputSx} />
                    <TextField size="small" value={vals.unit} onChange={e => setVals(p => ({ ...p, unit: e.target.value }))} sx={inputSx} />
                    <Typography sx={{ ...cellSx }}>${((parseInt(vals.qty) || 0) * (parseFloat(vals.unit) || 0)).toLocaleString()}</Typography>
                    <Typography sx={{ ...cellSx, fontSize: 11, color: T.subtle }}>{sku.delivery}</Typography>
                    <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={save} sx={{ color: "#4dff88", p: 0.5 }}><Check sx={{ fontSize: 14 }} /></IconButton>
                        <IconButton size="small" onClick={() => setEditing(false)} sx={{ color: T.muted, p: 0.5 }}><Close sx={{ fontSize: 14 }} /></IconButton>
                    </Stack>
                </>
            ) : (
                <>
                    <Typography sx={cellSx}>{sku.qty}</Typography>
                    <Typography sx={cellSx}>${sku.unit.toFixed(2)}</Typography>
                    <Typography sx={cellSx}>${sku.total.toLocaleString()}</Typography>
                    <Typography sx={{ ...cellSx, fontSize: 11, color: T.subtle }}>{sku.delivery}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Button
                            size="small"
                            startIcon={<Edit sx={{ fontSize: "10px !important" }} />}
                            onClick={() => { setVals({ qty: sku.qty, unit: sku.unit }); setEditing(true); }}
                            sx={{
                                fontSize: 9,
                                fontFamily: "'Inter', sans-serif",
                                color: "#666",
                                textTransform: "none",
                                border: "1px solid #2a2a2a",
                                borderRadius: 1,
                                bgcolor: "#1a1a1a",
                                px: 0.5,
                                py: 0.2,
                                minWidth: 0,
                                width: "fit-content",
                                lineHeight: 1,
                                "& .MuiButton-startIcon": { margin: 0 },
                                "&:hover": { bgcolor: "#1e2a1e", borderColor: "#a3e635", color: "#a3e635" },
                            }}
                        />

                        <IconButton
                            size="small"
                            onClick={() => { /* your close handler */ }}
                            sx={{
                                color: "#666",
                                bgcolor: "#1a1a1a",
                                border: "1px solid #2a2a2a",
                                borderRadius: 1,
                                p: 0.3,
                                "& .MuiSvgIcon-root": { fontSize: 10 },
                                "&:hover": { bgcolor: "#2a1a1a", borderColor: "#ff6b6b", color: "#ff6b6b" },
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </>
            )}
        </Box>
    );
}

// ─── PO CARD ──────────────────────────────────────────────────────────────────

function POCard({ po, vendor, onStatusChange, onAddSku, onEditSku }) {
    const [expanded, setExpanded] = useState(po.id === "PO-2034");
    const [addOpen, setAddOpen] = useState(false);

    const totalVal = po.skus.reduce((s, x) => s + x.total, 0);

    return (
        <>
            <AddSkuModal open={addOpen} vendorName={vendor.name} onClose={() => setAddOpen(false)}
                onAdd={sku => { onAddSku(po.id, sku); setAddOpen(false); }} />

            <Paper elevation={0} sx={{ background: T.surface, border: `1px solid ${expanded ? T.border2 : T.border}`, borderRadius: 2, overflow: "hidden", transition: "border-color 0.2s" }}>
                <Box onClick={() => setExpanded(p => !p)}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.75, cursor: "pointer", "&:hover": { background: "rgba(255,255,255,0.02)" } }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 34, height: 34, borderRadius: 1.5, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: T.subtle, fontWeight: 600 }}>{vendor.id}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: T.fs.md, fontWeight: 600, color: T.white }}>
                                {vendor.name} · <span style={{ color: T.subtle, fontWeight: 400 }}>{po.id}</span>
                            </Typography>
                            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: T.fs.xs, color: T.muted, mt: 0.25 }}>
                                {po.skus.length} SKUs · ${totalVal.toLocaleString()} · expected {po.delivery}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <StatusChip status={po.status} />
                        <Box sx={{ color: T.border2, fontSize: 18, transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", lineHeight: 1 }}>›</Box>
                    </Stack>
                </Box>

                <Collapse in={expanded}>
                    <Box sx={{ borderTop: `1px solid ${T.border}` }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 80px 90px 90px 90px 90px", gap: 1, px: 2.5, py: 1, borderBottom: `1px solid #1a1a1a` }}>
                            {["SKU", "QTY", "UNIT", "TOTAL", "DELIVERY", ""].map((h, i) => (
                                <Typography key={i} sx={{ fontSize: T.fs.xs, fontFamily: "'Inter', sans-serif", color: T.muted, letterSpacing: "0.06em" }}>{h}</Typography>
                            ))}
                        </Box>
                        <Box sx={{ px: 2.5 }}>
                            {po.skus.map((sku, i) => (
                                <SkuRow key={i} sku={sku} onEdit={vals => onEditSku(po.id, i, vals)} />
                            ))}
                            <Box sx={{ pt: 1.5, pb: 1 }}>
                                <Button size="small" startIcon={<Add sx={{ fontSize: "14px !important" }} />} onClick={() => setAddOpen(true)}
                                    sx={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: T.subtle, textTransform: "none", border: `1px dashed ${T.border2}`, borderRadius: 1.5, px: 1.5, "&:hover": { borderColor: "#444", color: T.text, background: "rgba(255,255,255,0.02)" } }}>
                                    Add SKU
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.5, borderTop: `1px solid ${T.border}`, background: "#0d0d0d" }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Email sx={{ fontSize: 15, color: T.muted }} />
                                <Box>
                                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: T.subtle }}>Will email PO to:</Typography>
                                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: T.dim }}>
                                        {vendor.email} · cc {vendor.cc}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Button size="small" sx={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: T.subtle, textTransform: "none", border: `1px solid ${T.border}`, borderRadius: 1, px: 1.5, "&:hover": { borderColor: "#444" } }}>
                                Edit recipients
                            </Button>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2.5, py: 1.5, borderTop: `1px solid ${T.border}` }}>
                            <Stack direction="row" spacing={1}>
                                <Button size="small" sx={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: T.subtle, textTransform: "none", border: `1px solid ${T.border2}`, borderRadius: 1.5, px: 1.5 }}>Save draft</Button>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Button size="small" onClick={() => onStatusChange(po.id, "rejected")}
                                    sx={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#f55", textTransform: "none", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 1.5, px: 1.5 }}>
                                    Reject
                                </Button>
                                <Button size="small" variant="contained" onClick={() => onStatusChange(po.id, "approved")}
                                    sx={{ background: T.white, color: "#000", fontWeight: 700, fontSize: 11, textTransform: "none", borderRadius: 1.5, px: 2, "&:hover": { background: "#e0e0e0" } }}>
                                    Approve & send
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Collapse>
            </Paper>
        </>
    );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ label, value, accent }) {
    return (
        <Paper elevation={0} sx={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontSize: T.fs.xs, fontFamily: "'Inter', sans-serif", color: T.muted, letterSpacing: "0.06em", mb: 0.5 }}>
                {label.toUpperCase()}
            </Typography>
            <Typography sx={{ fontSize: T.fs.xl, fontWeight: 700, color: accent ? T.white : T.text, letterSpacing: "-0.02em" }}>
                {value}
            </Typography>
        </Paper>
    );
}

// ─── FILTER TAB ───────────────────────────────────────────────────────────────

function FilterTab({ label, count, active, activeColor, onClick }) {
    return (
        <Button size="small" onClick={onClick}
            sx={{
                borderRadius: 5, fontSize: T.fs.sm, fontFamily: "'Inter', sans-serif", textTransform: "none", px: 1.5, py: 0.5,
                background: active ? (activeColor || T.white) : "transparent",
                color: active ? "#000" : T.subtle,
                border: active ? "none" : `1px solid ${T.border2}`,
                minWidth: 0,
                "&:hover": { background: active ? (activeColor || T.white) : "rgba(255,255,255,0.04)" },
            }}>
            {label} {count !== undefined && <span style={{ opacity: 0.7, marginLeft: 4 }}>{count}</span>}
        </Button>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function POWorkspace() {
    const [vendors, setVendors] = useState(initialVendors);
    const [filter, setFilter] = useState("all");
    const [unifiedFilter, setUnifiedFilter] = useState({ type: "all" });
    const [toast, setToast] = useState(null);

    const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

    const allPos = vendors.flatMap(v => v.pos.map(p => ({ ...p, vendor: v })));

    const counts = {
        draft: allPos.filter(p => p.status === "draft").length,
        approved: allPos.filter(p => p.status === "approved").length,
        sent: allPos.filter(p => p.status === "sent").length,
        acknowledged: allPos.filter(p => p.status === "acknowledged").length,
    };

    const totalValue = allPos.reduce((s, p) => s + p.skus.reduce((a, b) => a + b.total, 0), 0);

    // Apply status filter first, then unified filter
    const statusFiltered = allPos.filter(p => filter === "all" || p.status === filter);

    const filteredPos = statusFiltered.filter(p => {
        if (unifiedFilter.type === "all") return true;
        if (unifiedFilter.type === "vendor") return p.vendor.id === unifiedFilter.id;
        if (unifiedFilter.type === "product") return p.skus.some(s => s.sku === unifiedFilter.sku);
        return true;
    });

    const onStatusChange = (poId, newStatus) => {
        setVendors(vs =>
            vs.map(v => ({ ...v, pos: v.pos.map(p => p.id === poId ? { ...p, status: newStatus === "rejected" ? "draft" : "approved" } : p) }))
        );
        showToast(newStatus === "rejected" ? `${poId} rejected` : `${poId} approved & sent ✓`);
    };

    const onAddSku = (poId, sku) => {
        setVendors(vs =>
            vs.map(v => ({ ...v, pos: v.pos.map(p => p.id === poId ? { ...p, skus: [...p.skus, sku] } : p) }))
        );
        showToast(`SKU ${sku.sku} added ✓`);
    };

    const onEditSku = (poId, idx, vals) => {
        setVendors(vs =>
            vs.map(v => ({ ...v, pos: v.pos.map(p => p.id === poId ? { ...p, skus: p.skus.map((s, i) => i === idx ? { ...s, ...vals } : s) } : p) }))
        );
    };

    const bulkApprove = () => {
        setVendors(vs => vs.map(v => ({ ...v, pos: v.pos.map(p => p.status === "draft" ? { ...p, status: "approved" } : p) })));
        showToast("All drafts approved ✓");
    };

    const bulkSend = () => {
        setVendors(vs => vs.map(v => ({ ...v, pos: v.pos.map(p => p.status === "approved" ? { ...p, status: "sent" } : p) })));
        showToast("All approved POs sent ✓");
    };

    return (
        <Box sx={{ minHeight: "100vh", background: T.bg, display: "flex", fontFamily: "'Inter', sans-serif" }}>

            {toast && (
                <Box sx={{
                    position: "fixed", top: 20, right: 20, zIndex: 9999,
                    background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 1.5,
                    px: 2.5, py: 1.25, fontFamily: "'Inter', sans-serif", fontSize: 12, color: T.white,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    animation: "fadeUp 0.2s ease",
                    "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                }}>
                    {toast}
                </Box>
            )}

            <Box sx={{ flex: 1, overflowY: "auto", p: 4 }}>

                {/* Header */}
                <Box sx={{ mb: 3.5 }}>
                    <Typography sx={{ fontSize: T.fs.h1, fontWeight: 700, letterSpacing: "-0.01em", color: T.white }}>
                        PO workspace
                    </Typography>
                    <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: T.fs.xs, color: T.muted, mt: 0.5 }}>
                        Aria-generated POs awaiting your review or sent to vendors
                    </Typography>
                </Box>

                {/* Stats */}
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    <Grid item xs={3}><StatCard label="POs ready" value={allPos.length} /></Grid>
                    <Grid item xs={3}><StatCard label="Total value" value={`$${totalValue.toLocaleString()}`} accent /></Grid>
                    <Grid item xs={3}><StatCard label="Vendors" value={vendors.length} /></Grid>
                    <Grid item xs={3}><StatCard label="Delivery window" value="Mar 14–18" /></Grid>
                </Grid>

                {/* Filter row */}
                <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} sx={{ mb: 2.5 }}>
                    <FilterTab label="All" active={filter === "all"} onClick={() => setFilter("all")} />
                    <FilterTab label="Draft" count={counts.draft} activeColor="#f5c842" active={filter === "draft"} onClick={() => setFilter("draft")} />
                    <FilterTab label="Approved" count={counts.approved} activeColor="#42b0f5" active={filter === "approved"} onClick={() => setFilter("approved")} />
                    <FilterTab label="Sent" count={counts.sent} activeColor="#d966ff" active={filter === "sent"} onClick={() => setFilter("sent")} />
                    <FilterTab label="Acknowledged" count={counts.acknowledged} activeColor="#4dff88" active={filter === "acknowledged"} onClick={() => setFilter("acknowledged")} />

                    <Box sx={{ flex: 1 }} />

                    {/* Single unified dropdown */}
                    <UnifiedFilterDropdown
                        vendors={vendors}
                        value={unifiedFilter}
                        onChange={setUnifiedFilter}
                    />
                </Stack>

                {/* Active filter badge */}
                {unifiedFilter.type !== "all" && (
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip
                            label={
                                unifiedFilter.type === "vendor"
                                    ? `Vendor: ${vendors.find(v => v.id === unifiedFilter.id)?.name}`
                                    : `Product: ${vendors.flatMap(v => v.pos.flatMap(p => p.skus)).find(s => s.sku === unifiedFilter.sku)?.name}`
                            }
                            size="small"
                            onDelete={() => setUnifiedFilter({ type: "all" })}
                            sx={{
                                background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border2}`,
                                color: T.text, fontFamily: "'Inter', sans-serif", fontSize: 11, height: 24,
                                "& .MuiChip-deleteIcon": { color: T.subtle, fontSize: 14, "&:hover": { color: T.text } },
                            }}
                        />
                        <Button size="small" onClick={() => setUnifiedFilter({ type: "all" })}
                            sx={{ fontSize: 10, fontFamily: "'Inter', sans-serif", color: T.subtle, textTransform: "none", p: 0, minWidth: 0, "&:hover": { color: T.text } }}>
                            Clear
                        </Button>
                    </Stack>
                )}

                {/* Content: product view OR PO list */}
                {unifiedFilter.type === "product" ? (
                    <ProductView sku={unifiedFilter.sku} vendors={vendors} />
                ) : (
                    <Stack spacing={1.25}>
                        {filteredPos.length > 0 ? (
                            filteredPos.map(po => (
                                <POCard
                                    key={`${po.vendor.id}-${po.id}`}
                                    po={po}
                                    vendor={po.vendor}
                                    onStatusChange={onStatusChange}
                                    onAddSku={onAddSku}
                                    onEditSku={onEditSku}
                                />
                            ))
                        ) : (
                            <Box sx={{ textAlign: "center", py: 10, color: T.border2, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
                                No POs match the selected filters
                            </Box>
                        )}
                    </Stack>
                )}
            </Box>

            {/* Sidebar */}
            <Box sx={{ width: 240, background: "#0d0d0d", borderLeft: `1px solid ${T.border}`, p: 3, overflowY: "auto", flexShrink: 0 }}>
                <Typography sx={{ fontSize: 9, fontFamily: "'Inter', sans-serif", color: T.muted, letterSpacing: "0.1em", mb: 1.5 }}>
                    BULK ACTIONS
                </Typography>
                <Stack spacing={1} sx={{ mb: 3.5 }}>
                    <Button fullWidth onClick={bulkApprove} size="small"
                        sx={{ background: T.surface, border: `1px solid ${T.border2}`, color: T.text, fontSize: 11, textTransform: "none", borderRadius: 1.5, "&:hover": { background: T.surface2 } }}>
                        Approve all drafts
                    </Button>
                    <Button fullWidth onClick={bulkSend} size="small"
                        sx={{ background: T.surface, border: `1px solid ${T.border2}`, color: T.text, fontSize: 11, textTransform: "none", borderRadius: 1.5, "&:hover": { background: T.surface2 } }}>
                        Send all approved
                    </Button>
                </Stack>

                <Divider sx={{ borderColor: T.border, mb: 3 }} />

                <Typography sx={{ fontSize: 9, fontFamily: "'Inter', sans-serif", color: T.muted, letterSpacing: "0.1em", mb: 2 }}>
                    RECENT ACTIVITY
                </Typography>
                <Stack spacing={2.5}>
                    {recentActivities.map((a, i) => (
                        <Box key={i}>
                            <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: T.muted, mb: 0.5 }}>{a.time}</Typography>
                            <Typography sx={{ fontSize: 11, color: T.dim, lineHeight: 1.5 }}>{a.text}</Typography>
                            {a.alert && (
                                <Box sx={{ mt: 1, background: "rgba(245,200,66,0.06)", border: "1px solid rgba(245,200,66,0.2)", borderRadius: 1.5, p: 1.25 }}>
                                    <Typography sx={{ fontSize: 10, color: "#f5c842", fontWeight: 700, mb: 0.5 }}>{a.alertTitle}</Typography>
                                    <Typography sx={{ fontSize: 10, color: "#aa8820", lineHeight: 1.5 }}>{a.alertBody}</Typography>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
}