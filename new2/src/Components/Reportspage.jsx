import React, { useState } from "react";
import {
  Box, Typography, Button, Chip, Table, TableBody, TableCell,
  TableHead, TableRow, Divider, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Select, MenuItem,
  FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput,
  TextField,
} from "@mui/material";
import GridOnIcon from "@mui/icons-material/GridOn";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// ─── Shared styles ─────────────────────────────────────────────────────────────
const inputSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#0d0d0d",
    borderRadius: "10px",
    fontSize: 13,
    color: "#ccc",
    fontFamily: "'Inter', sans-serif",
    "& fieldset": { borderColor: "#222" },
    "&:hover fieldset": { borderColor: "#333" },
    "&.Mui-focused fieldset": { borderColor: "#22c55e", borderWidth: 1 },
  },
  "& .MuiInputLabel-root": { color: "#555", fontSize: 13, fontFamily: "'Inter', sans-serif" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#22c55e" },
  "& .MuiSelect-icon": { color: "#555" },
};

const menuPaperSx = {
  PaperProps: {
    sx: {
      backgroundColor: "#0d0d0d",
      border: "1px solid #222",
      borderRadius: "12px",
      "& .MuiMenuItem-root": {
        fontSize: 13,
        color: "#ccc",
        fontFamily: "'Inter', sans-serif",
        "&:hover": { backgroundColor: "#181818" },
        "&.Mui-selected": { backgroundColor: "#0d1f10", color: "#22c55e" },
        "&.Mui-selected:hover": { backgroundColor: "#0d1f10" },
      },
    },
  },
};

// ─── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <Typography sx={{
    fontSize: 11, fontWeight: 700, letterSpacing: "1.2px", color: "#555",
    fontFamily: "'Inter', sans-serif", textTransform: "uppercase", mb: 2,
  }}>
    {children}
  </Typography>
);

// ─── Filter Dropdown (single select) ──────────────────────────────────────────
function FilterSelect({ label, value, onChange, options }) {
  return (
    <FormControl size="small" sx={{ minWidth: 150, ...inputSx }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={(e) => onChange(e.target.value)} label={label} MenuProps={menuPaperSx}>
        <MenuItem value=""><em style={{ color: "#555", fontStyle: "normal" }}>All</em></MenuItem>
        {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </Select>
    </FormControl>
  );
}

// ─── Date range pair ───────────────────────────────────────────────────────────
function DateRangeFilter({ from, to, onFrom, onTo }) {
  const dateInputSx = {
    backgroundColor: "transparent", border: "none", color: "#ccc",
    fontSize: 12, fontFamily: "'Inter', sans-serif", outline: "none",
    colorScheme: "dark", cursor: "pointer", width: 120,
  };
  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 1,
      backgroundColor: "#0d0d0d", border: "1px solid #222",
      borderRadius: "10px", px: 1.5, py: "6px", height: 40,
    }}>
      <Typography sx={{ fontSize: 11, color: "#555", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>From</Typography>
      <input type="date" value={from} onChange={(e) => onFrom(e.target.value)} style={{ ...dateInputSx, color: from ? "#ccc" : "#444" }} />
      <Box sx={{ width: 1, height: 14, backgroundColor: "#222" }} />
      <Typography sx={{ fontSize: 11, color: "#555", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>To</Typography>
      <input type="date" value={to} onChange={(e) => onTo(e.target.value)} style={{ ...dateInputSx, color: to ? "#ccc" : "#444" }} />
    </Box>
  );
}

// ─── Checkbox row ──────────────────────────────────────────────────────────────
function CheckRow({ item, checked, onToggle, meta }) {
  return (
    <Box
      onClick={() => onToggle(item.id)}
      sx={{
        display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.4,
        cursor: "pointer", borderBottom: "1px solid #111",
        "&:hover": { backgroundColor: "#0a0a0a" }, transition: "background 0.15s",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Checkbox
        checked={checked}
        size="small"
        icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 17, color: "#333" }} />}
        checkedIcon={<CheckBoxIcon sx={{ fontSize: 17, color: "#22c55e" }} />}
        sx={{ p: 0 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#e0e0e0", fontFamily: "'Inter', sans-serif" }}>
          {item.name}
        </Typography>
        {meta && (
          <Typography sx={{ fontSize: 11.5, color: "#444", fontFamily: "'Inter', sans-serif", mt: 0.2 }}>
            {meta}
          </Typography>
        )}
      </Box>
      {item.badge && (
        <Chip label={item.badge} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 700, backgroundColor: "#0d1a0d", color: "#22c55e", border: "1px solid #1a3a1a" }} />
      )}
    </Box>
  );
}

// ─── Product Report Modal ──────────────────────────────────────────────────────
const productData = [
  { id: 1, name: "Nike Air Max 270",      sku: "NKE-AM270-BLK-10", badge: "Active",  platform: "Shopify",     location: "Warehouse A" },
  { id: 2, name: "Adidas Ultraboost 22",  sku: "ADI-UB22-WHT-9",   badge: "Active",  platform: "Shopify",     location: "Warehouse B" },
  { id: 3, name: "Levi's 501 Jeans",      sku: "LEV-501-BLU-32",   badge: "Active",  platform: "WooCommerce", location: "Warehouse A" },
  { id: 4, name: "Hanes Crew T-Shirt",    sku: "HAN-CREW-WHT-L",   badge: "Low stock", platform: "Amazon",    location: "Warehouse C" },
  { id: 5, name: "Ray-Ban Aviator",       sku: "RB-AV-GLD-M",      badge: "Active",  platform: "Shopify",     location: "Warehouse B" },
  { id: 6, name: "Sony WH-1000XM5",       sku: "SNY-WH5-BLK",      badge: "Active",  platform: "Amazon",      location: "Warehouse A" },
  { id: 7, name: "Apple AirPods Pro",     sku: "APL-APP-2GEN",      badge: "Active",  platform: "WooCommerce", location: "Warehouse C" },
  { id: 8, name: "Patagonia Nano Puff",   sku: "PAT-NP-BLK-M",     badge: "Active",  platform: "Shopify",     location: "Warehouse A" },
  { id: 9, name: "Yeti Tumbler 30oz",     sku: "YET-TUM-SLT-30",   badge: "Low stock", platform: "Amazon",    location: "Warehouse B" },
  { id: 10, name: "Kindle Paperwhite",    sku: "KDL-PW-11GEN",      badge: "Active",  platform: "WooCommerce", location: "Warehouse C" },
];

function ProductReportModal({ open, onClose }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch]     = useState("");
  const [platform, setPlatform] = useState("");
  const [location, setLocation] = useState("");
  const [from, setFrom]         = useState("");
  const [to, setTo]             = useState("");

  const toggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(filtered.length === selected.length && filtered.every(f => selected.includes(f.id)) ? [] : filtered.map((f) => f.id));

  const filtered = productData.filter((p) => {
    const q = search.toLowerCase();
    return (
      (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
      (!platform || p.platform === platform) &&
      (!location || p.location === location)
    );
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every((f) => selected.includes(f.id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
      sx: { backgroundColor: "#080808", border: "1px solid #1a1a1a", borderRadius: "18px", backgroundImage: "none" }
    }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, pt: 2.5, px: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Inter', sans-serif" }}>
            Product / SKU Report
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: "#555", fontFamily: "'Inter', sans-serif", mt: 0.3 }}>
            Select products to include in this export
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#555", "&:hover": { color: "#ccc", backgroundColor: "#111" } }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1 }}>
        {/* Filters */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 2.5, alignItems: "center" }}>
          {/* Search */}
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1, backgroundColor: "#0d0d0d",
            border: "1px solid #222", borderRadius: "10px", px: 1.5, height: 40, flex: "1 1 180px",
            "&:focus-within": { borderColor: "#22c55e" }, transition: "border-color 0.2s",
          }}>
            <SearchIcon sx={{ fontSize: 16, color: "#444" }} />
            <input
              placeholder="Search products or SKU…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "#ccc", fontSize: 13, fontFamily: "'Inter', sans-serif", width: "100%" }}
            />
          </Box>
          <FilterSelect label="Platform" value={platform} onChange={setPlatform} options={["Shopify", "WooCommerce", "Amazon"]} />
          <FilterSelect label="Location" value={location} onChange={setLocation} options={["Warehouse A", "Warehouse B", "Warehouse C"]} />
          <DateRangeFilter from={from} to={to} onFrom={setFrom} onTo={setTo} />
        </Box>

        {/* Select-all bar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, borderBottom: "1px solid #111" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }} onClick={toggleAll}>
            <Checkbox
              checked={allFilteredSelected}
              size="small"
              icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 17, color: "#333" }} />}
              checkedIcon={<CheckBoxIcon sx={{ fontSize: 17, color: "#22c55e" }} />}
              sx={{ p: 0 }}
            />
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              {allFilteredSelected ? "Deselect all" : "Select all"}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: "#333", fontFamily: "'Inter', sans-serif" }}>
            {selected.length} selected · {filtered.length} shown
          </Typography>
        </Box>

        {/* List */}
        <Box sx={{ maxHeight: 340, overflowY: "auto", "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { background: "#222", borderRadius: 4 } }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <Typography sx={{ color: "#333", fontSize: 13, fontFamily: "'Inter', sans-serif" }}>No products match your filters</Typography>
            </Box>
          ) : filtered.map((p) => (
            <CheckRow
              key={p.id} item={{ ...p, badge: p.badge }}
              checked={selected.includes(p.id)}
              onToggle={toggle}
              meta={`SKU: ${p.sku} · ${p.platform} · ${p.location}`}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, borderTop: "1px solid #111", gap: 1 }}>
        <Button onClick={onClose} sx={{ color: "#555", fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif", borderRadius: "10px", px: 2, "&:hover": { backgroundColor: "#0d0d0d", color: "#aaa" } }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={selected.length === 0}
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 15 }} />}
          sx={{
            backgroundColor: selected.length > 0 ? "#fff" : "#1a1a1a",
            color: selected.length > 0 ? "#000" : "#333",
            fontSize: 13, fontWeight: 700, borderRadius: "10px", px: 2.5,
            "&:hover": { backgroundColor: "#e0e0e0" },
            "&.Mui-disabled": { backgroundColor: "#111", color: "#333" },
          }}
        >
          Download {selected.length > 0 ? `${selected.length} product${selected.length > 1 ? "s" : ""}` : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Store Report Modal ────────────────────────────────────────────────────────
const storeData = [
  { id: 1, name: "NYC Flagship",       location: "New York, US",    vendor: "Shopify",     meta: "12 active SKUs · $48,200 inv value" },
  { id: 2, name: "LA Sunset Store",    location: "Los Angeles, US", vendor: "WooCommerce", meta: "8 active SKUs · $31,500 inv value"  },
  { id: 3, name: "Chicago Loop",       location: "Chicago, US",     vendor: "Shopify",     meta: "15 active SKUs · $62,800 inv value" },
  { id: 4, name: "London Oxford St",   location: "London, UK",      vendor: "Amazon",      meta: "6 active SKUs · $24,100 inv value"  },
  { id: 5, name: "Sydney CBD",         location: "Sydney, AU",      vendor: "Shopify",     meta: "9 active SKUs · $37,400 inv value"  },
  { id: 6, name: "Toronto Eaton",      location: "Toronto, CA",     vendor: "WooCommerce", meta: "7 active SKUs · $28,900 inv value"  },
  { id: 7, name: "Berlin Mitte",       location: "Berlin, DE",      vendor: "Amazon",      meta: "5 active SKUs · $19,200 inv value"  },
  { id: 8, name: "Singapore Marina",   location: "Singapore, SG",   vendor: "Shopify",     meta: "11 active SKUs · $44,600 inv value" },
];

function StoreReportModal({ open, onClose }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch]     = useState("");
  const [vendor, setVendor]     = useState("");
  const [location, setLocation] = useState("");
  const [from, setFrom]         = useState("");
  const [to, setTo]             = useState("");

  const toggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const filtered = storeData.filter((s) =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase())) &&
    (!vendor   || s.vendor   === vendor) &&
    (!location || s.location === location)
  );

  const allFilteredSelected = filtered.length > 0 && filtered.every((f) => selected.includes(f.id));
  const toggleAll = () => setSelected(allFilteredSelected ? [] : filtered.map((f) => f.id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
      sx: { backgroundColor: "#080808", border: "1px solid #1a1a1a", borderRadius: "18px", backgroundImage: "none" }
    }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, pt: 2.5, px: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Inter', sans-serif" }}>
            Store-level Report
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: "#555", fontFamily: "'Inter', sans-serif", mt: 0.3 }}>
            Select stores to include in this export
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#555", "&:hover": { color: "#ccc", backgroundColor: "#111" } }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1 }}>
        {/* Filters */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 2.5, alignItems: "center" }}>
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1, backgroundColor: "#0d0d0d",
            border: "1px solid #222", borderRadius: "10px", px: 1.5, height: 40, flex: "1 1 180px",
            "&:focus-within": { borderColor: "#22c55e" }, transition: "border-color 0.2s",
          }}>
            <SearchIcon sx={{ fontSize: 16, color: "#444" }} />
            <input
              placeholder="Search stores or location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: "transparent", border: "none", outline: "none", color: "#ccc", fontSize: 13, fontFamily: "'Inter', sans-serif", width: "100%" }}
            />
          </Box>
          <FilterSelect label="Vendor" value={vendor} onChange={setVendor} options={["Shopify", "WooCommerce", "Amazon"]} />
          <FilterSelect label="Location" value={location} onChange={setLocation} options={[...new Set(storeData.map((s) => s.location))]} />
          <DateRangeFilter from={from} to={to} onFrom={setFrom} onTo={setTo} />
        </Box>

        {/* Select-all bar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, borderBottom: "1px solid #111" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }} onClick={toggleAll}>
            <Checkbox
              checked={allFilteredSelected}
              size="small"
              icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 17, color: "#333" }} />}
              checkedIcon={<CheckBoxIcon sx={{ fontSize: 17, color: "#22c55e" }} />}
              sx={{ p: 0 }}
            />
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              {allFilteredSelected ? "Deselect all" : "Select all"}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: "#333", fontFamily: "'Inter', sans-serif" }}>
            {selected.length} selected · {filtered.length} shown
          </Typography>
        </Box>

        {/* List */}
        <Box sx={{ maxHeight: 340, overflowY: "auto", "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { background: "#222", borderRadius: 4 } }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <Typography sx={{ color: "#333", fontSize: 13, fontFamily: "'Inter', sans-serif" }}>No stores match your filters</Typography>
            </Box>
          ) : filtered.map((s) => (
            <CheckRow
              key={s.id} item={s}
              checked={selected.includes(s.id)}
              onToggle={toggle}
              meta={`${s.location} · ${s.vendor} · ${s.meta}`}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, borderTop: "1px solid #111", gap: 1 }}>
        <Button onClick={onClose} sx={{ color: "#555", fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif", borderRadius: "10px", px: 2, "&:hover": { backgroundColor: "#0d0d0d", color: "#aaa" } }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={selected.length === 0}
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 15 }} />}
          sx={{
            backgroundColor: selected.length > 0 ? "#fff" : "#1a1a1a",
            color: selected.length > 0 ? "#000" : "#333",
            fontSize: 13, fontWeight: 700, borderRadius: "10px", px: 2.5,
            "&:hover": { backgroundColor: "#e0e0e0" },
            "&.Mui-disabled": { backgroundColor: "#111", color: "#333" },
          }}
        >
          Download {selected.length > 0 ? `${selected.length} store${selected.length > 1 ? "s" : ""}` : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Purchase Order Modal ──────────────────────────────────────────────────────
const poData = [
  { id: 1,  name: "PO-2026-0041", vendor: "Nike Inc.",       status: "Delivered",    value: "$12,400", date: "Apr 28, 2026", items: 24 },
  { id: 2,  name: "PO-2026-0040", vendor: "Adidas Group",    status: "In Transit",   value: "$8,750",  date: "Apr 25, 2026", items: 16 },
  { id: 3,  name: "PO-2026-0039", vendor: "Levi Strauss",    status: "Pending",      value: "$5,200",  date: "Apr 22, 2026", items: 10 },
  { id: 4,  name: "PO-2026-0038", vendor: "Sony Electronics",status: "Delivered",    value: "$22,100", date: "Apr 18, 2026", items: 31 },
  { id: 5,  name: "PO-2026-0037", vendor: "Apple Inc.",      status: "In Transit",   value: "$44,800", date: "Apr 15, 2026", items: 45 },
  { id: 6,  name: "PO-2026-0036", vendor: "Patagonia",       status: "Delivered",    value: "$7,300",  date: "Apr 10, 2026", items: 14 },
  { id: 7,  name: "PO-2026-0035", vendor: "Yeti Coolers",    status: "Pending",      value: "$3,600",  date: "Apr 06, 2026", items: 8  },
  { id: 8,  name: "PO-2026-0034", vendor: "Nike Inc.",       status: "Cancelled",    value: "$9,900",  date: "Mar 30, 2026", items: 19 },
  { id: 9,  name: "PO-2026-0033", vendor: "Adidas Group",    status: "Delivered",    value: "$14,500", date: "Mar 24, 2026", items: 28 },
  { id: 10, name: "PO-2026-0032", vendor: "Levi Strauss",    status: "In Transit",   value: "$6,800",  date: "Mar 18, 2026", items: 13 },
];

const statusColors = {
  "Delivered":  { bg: "#0d1a0d", color: "#22c55e", border: "#1a3a1a" },
  "In Transit": { bg: "#001a2e", color: "#38bdf8", border: "#003355" },
  "Pending":    { bg: "#191900", color: "#facc15", border: "#2a2a00" },
  "Cancelled":  { bg: "#1a0808", color: "#ef4444", border: "#3a1111" },
};

function POReportModal({ open, onClose }) {
  const [selected, setSelected] = useState([]);
  const [vendor, setVendor]     = useState("");
  const [status, setStatus]     = useState("");
  const [from, setFrom]         = useState("");
  const [to, setTo]             = useState("");

  const toggle = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const filtered = poData.filter((p) =>
    (!vendor || p.vendor === vendor) &&
    (!status || p.status === status)
  );

  const allFilteredSelected = filtered.length > 0 && filtered.every((f) => selected.includes(f.id));
  const toggleAll = () => setSelected(allFilteredSelected ? [] : filtered.map((f) => f.id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
      sx: { backgroundColor: "#080808", border: "1px solid #1a1a1a", borderRadius: "18px", backgroundImage: "none" }
    }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1, pt: 2.5, px: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Inter', sans-serif" }}>
            Purchase Order Report
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: "#555", fontFamily: "'Inter', sans-serif", mt: 0.3 }}>
            Select purchase orders to include in this export
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#555", "&:hover": { color: "#ccc", backgroundColor: "#111" } }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1 }}>
        {/* Filters */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 2.5, alignItems: "center" }}>
          <FilterSelect label="Vendor" value={vendor} onChange={setVendor} options={[...new Set(poData.map((p) => p.vendor))]} />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={["Delivered", "In Transit", "Pending", "Cancelled"]} />
          <DateRangeFilter from={from} to={to} onFrom={setFrom} onTo={setTo} />
        </Box>

        {/* Select-all bar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, borderBottom: "1px solid #111" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }} onClick={toggleAll}>
            <Checkbox
              checked={allFilteredSelected}
              size="small"
              icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 17, color: "#333" }} />}
              checkedIcon={<CheckBoxIcon sx={{ fontSize: 17, color: "#22c55e" }} />}
              sx={{ p: 0 }}
            />
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#555", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              {allFilteredSelected ? "Deselect all" : "Select all"}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: "#333", fontFamily: "'Inter', sans-serif" }}>
            {selected.length} selected · {filtered.length} shown
          </Typography>
        </Box>

        {/* PO Table */}
        <Box sx={{ maxHeight: 340, overflowY: "auto", "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { background: "#222", borderRadius: 4 } }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <Typography sx={{ color: "#333", fontSize: 13, fontFamily: "'Inter', sans-serif" }}>No POs match your filters</Typography>
            </Box>
          ) : filtered.map((p) => {
            const sc = statusColors[p.status] || statusColors["Pending"];
            return (
              <Box
                key={p.id}
                onClick={() => toggle(p.id)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.4,
                  cursor: "pointer", borderBottom: "1px solid #111",
                  "&:hover": { backgroundColor: "#0a0a0a" }, transition: "background 0.15s",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Checkbox
                  checked={selected.includes(p.id)}
                  size="small"
                  icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 17, color: "#333" }} />}
                  checkedIcon={<CheckBoxIcon sx={{ fontSize: 17, color: "#22c55e" }} />}
                  sx={{ p: 0, flexShrink: 0 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#e0e0e0", fontFamily: "'Inter', sans-serif" }}>
                    {p.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11.5, color: "#444", fontFamily: "'Inter', sans-serif", mt: 0.2 }}>
                    {p.vendor} · {p.items} items · {p.date}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#aaa", fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>
                  {p.value}
                </Typography>
                <Box sx={{
                  px: 1, py: 0.3, borderRadius: "6px", flexShrink: 0,
                  backgroundColor: sc.bg, border: `1px solid ${sc.border}`,
                }}>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: sc.color, fontFamily: "'Inter', sans-serif" }}>
                    {p.status}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, borderTop: "1px solid #111", gap: 1 }}>
        <Button onClick={onClose} sx={{ color: "#555", fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif", borderRadius: "10px", px: 2, "&:hover": { backgroundColor: "#0d0d0d", color: "#aaa" } }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={selected.length === 0}
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 15 }} />}
          sx={{
            backgroundColor: selected.length > 0 ? "#fff" : "#1a1a1a",
            color: selected.length > 0 ? "#000" : "#333",
            fontSize: 13, fontWeight: 700, borderRadius: "10px", px: 2.5,
            "&:hover": { backgroundColor: "#e0e0e0" },
            "&.Mui-disabled": { backgroundColor: "#111", color: "#333" },
          }}
        >
          Download {selected.length > 0 ? `${selected.length} PO${selected.length > 1 ? "s" : ""}` : ""}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Report Card ──────────────────────────────────────────────────────────────
const reportIconMap = {
  "Product / SKU report":  { icon: <GridOnIcon sx={{ fontSize: 20 }} />,         bg: "#1a2e1a", color: "#4ade80" },
  "Store-level report":    { icon: <BookmarkBorderIcon sx={{ fontSize: 20 }} />,  bg: "#1e2a1a", color: "#86efac" },
  "Purchase order report": { icon: <ArticleOutlinedIcon sx={{ fontSize: 20 }} />, bg: "#1a1a2e", color: "#818cf8" },
};

function ReportCard({ title, description, csvInfo, lastGen, onOpen }) {
  const meta = reportIconMap[title] || { icon: <ArticleOutlinedIcon />, bg: "#1a1a1a", color: "#fff" };

  return (
    <Box
      sx={{
        flex: "1 1 0", minWidth: 220,
        backgroundColor: "#0d0d0d", border: "1px solid #1a1a1a",
        borderRadius: "14px", p: 2.5,
        display: "flex", flexDirection: "column", gap: 1.5,
        transition: "border-color 0.2s, transform 0.15s",
        cursor: "pointer",
        "&:hover": { borderColor: "#2a2a2a", transform: "translateY(-1px)" },
      }}
      onClick={onOpen}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ width: 40, height: 40, borderRadius: "10px", backgroundColor: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", color: meta.color }}>
          {meta.icon}
        </Box>
        <Typography sx={{ fontSize: 11, color: "#555", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
          {csvInfo}
        </Typography>
      </Box>

      <Box>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "'Inter', sans-serif", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 12.5, color: "#666", fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
          {description}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto", pt: 1.5, borderTop: "1px solid #181818" }}>
        <Typography sx={{ fontSize: 11.5, color: "#444", fontFamily: "'Inter', sans-serif" }}>
          Last gen: {lastGen}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 15 }} />}
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          sx={{
            backgroundColor: "#fff", color: "#000", fontSize: 12, fontWeight: 700,
            borderRadius: "8px", px: 1.8, py: 0.7, minWidth: "unset",
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          Download
        </Button>
      </Box>
    </Box>
  );
}

// ─── Recent Downloads ─────────────────────────────────────────────────────────
const recentDownloads = [
  { report: "Product / SKU report",  file: "products_30d_mar15.csv · 142 rows",  period: "Last 30d",  generated: "2h ago"       },
  { report: "PO report",             file: "pos_q1_2026.csv · 124 rows",          period: "Custom",    generated: "Yesterday"    },
  { report: "Store-level report",    file: "store_30d_mar01.csv · 1 row",         period: "Last 30d",  generated: "2 weeks ago"  },
  { report: "Product / SKU report",  file: "products_7d_apr28.csv · 38 rows",     period: "Last 7d",   generated: "3 weeks ago"  },
  { report: "Purchase order report", file: "pos_90d_feb01.csv · 310 rows",        period: "Last 90d",  generated: "1 month ago"  },
  { report: "Store-level report",    file: "store_custom_jan.csv · 1 row",        period: "Custom",    generated: "1 month ago"  },
  { report: "PO report",             file: "pos_30d_feb15.csv · 87 rows",         period: "Last 30d",  generated: "6 weeks ago"  },
  { report: "Product / SKU report",  file: "products_90d_jan01.csv · 142 rows",   period: "Last 90d",  generated: "2 months ago" },
];

const periodChip = {
  "Last 7d":  { bg: "#191900", color: "#a3a300", border: "#2a2a00" },
  "Last 30d": { bg: "#001a1a", color: "#38bdf8", border: "#003333" },
  "Last 90d": { bg: "#1a001a", color: "#c084fc", border: "#2a003a" },
  "Custom":   { bg: "#141414", color: "#777",    border: "#222"    },
};

function RecentDownloads() {
  const [visibleCount, setVisibleCount] = useState(5);
  const shown = recentDownloads.slice(0, visibleCount);
  const hasMore = visibleCount < recentDownloads.length;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1.5 }}>
        <SectionLabel>Recent Downloads</SectionLabel>
        <Typography sx={{ fontSize: 11.5, color: "#333", fontFamily: "'Inter', sans-serif" }}>
          {recentDownloads.length} total
        </Typography>
      </Box>

      <Box sx={{ border: "1px solid #181818", borderRadius: "12px", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              {["Report", "Period", "Generated", ""].map((h, i) => (
                <TableCell key={i} align={i === 3 ? "right" : "left"}
                  sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#777", backgroundColor: "#000", padding: "12px 18px", borderBottom: "1px solid #111", fontFamily: "'Inter', sans-serif" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {shown.map((row, i) => {
              const chip = periodChip[row.period] || periodChip["Custom"];
              return (
                <TableRow key={i} sx={{ "&:last-child td": { borderBottom: "none" }, "&:hover": { backgroundColor: "#060606" }, transition: "background 0.15s" }}>
                  <TableCell sx={{ borderBottom: "1px solid #111", padding: "16px 18px" }}>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#e0e0e0", fontFamily: "'Inter', sans-serif" }}>{row.report}</Typography>
                    <Typography sx={{ fontSize: 11.5, color: "#333", fontFamily: "'Inter', sans-serif", mt: 0.2 }}>{row.file}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #111", padding: "16px 18px" }}>
                    <Box sx={{ display: "inline-flex", alignItems: "center", backgroundColor: chip.bg, border: `1px solid ${chip.border}`, borderRadius: "6px", px: 1, py: 0.3 }}>
                      <Typography sx={{ fontSize: 11.5, color: chip.color, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{row.period}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #111", padding: "16px 18px" }}>
                    <Typography sx={{ fontSize: 13, color: "#555", fontFamily: "'Inter', sans-serif" }}>{row.generated}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ borderBottom: "1px solid #111", padding: "16px 18px" }}>
                    <Tooltip title="Download again">
                      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, cursor: "pointer", color: "#22c55e", fontSize: 12.5, fontWeight: 600, fontFamily: "'Inter', sans-serif", "&:hover": { color: "#4ade80" }, transition: "color 0.15s" }}>
                        <FileDownloadOutlinedIcon sx={{ fontSize: 14 }} />
                        again
                      </Box>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Box onClick={() => setVisibleCount(hasMore ? recentDownloads.length : 5)}
          sx={{ borderTop: "1px solid #111", py: 1.5, textAlign: "center", cursor: "pointer", "&:hover": { backgroundColor: "#060606" }, transition: "background 0.15s" }}>
          <Typography sx={{ fontSize: 12.5, color: "#383838", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
            {hasMore ? `Show ${recentDownloads.length - visibleCount} more ↓` : "Show less ↑"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Core Reports Data ────────────────────────────────────────────────────────
const coreReports = [
  { title: "Product / SKU report",  description: "Stock levels, velocity, days of cover, and Aria's autonomy state per SKU.",    csvInfo: "CSV · 142 rows", lastGen: "12 min ago" },
  { title: "Store-level report",    description: "Revenue, total inventory value, capital deployed, and agent activity summary.", csvInfo: "CSV · 1 row",    lastGen: "12 min ago" },
  { title: "Purchase order report", description: "All POs by status, vendor, value, and delivery performance.",                  csvInfo: "CSV · 47 rows",  lastGen: "12 min ago" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [modal, setModal] = useState(null); // "product" | "store" | "po"

  return (
    <Box sx={{
      height: "100%", overflowY: "auto", backgroundColor: "#000",
      px: { xs: 2, sm: 4, md: 6 }, py: 5, fontFamily: "'Inter', sans-serif",
      "&::-webkit-scrollbar": { width: 6 },
      "&::-webkit-scrollbar-track": { background: "transparent" },
      "&::-webkit-scrollbar-thumb": { background: "#222", borderRadius: 4 },
      "&::-webkit-scrollbar-thumb:hover": { background: "#333" },
    }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 700, color: "#fff", fontFamily: "'Inter', sans-serif", lineHeight: 1.1 }}>
          Reports
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: "#555", fontFamily: "'Inter', sans-serif", mt: 0.4 }}>
          Download data for analysis, finance, and compliance
        </Typography>
      </Box>

      {/* Core Reports */}
      <Box sx={{ mb: 5 }}>
        <SectionLabel>Core Reports</SectionLabel>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <ReportCard {...coreReports[0]} onOpen={() => setModal("product")} />
          <ReportCard {...coreReports[1]} onOpen={() => setModal("store")}   />
          <ReportCard {...coreReports[2]} onOpen={() => setModal("po")}      />
        </Box>
      </Box>

      {/* Recent Downloads */}
      <Box sx={{ pb: 4 }}>
        <RecentDownloads />
      </Box>

      {/* Modals */}
      <ProductReportModal open={modal === "product"} onClose={() => setModal(null)} />
      <StoreReportModal   open={modal === "store"}   onClose={() => setModal(null)} />
      <POReportModal      open={modal === "po"}      onClose={() => setModal(null)} />
    </Box>
  );
}