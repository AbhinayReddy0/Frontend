// DecisionReview.jsx
import { useState } from "react";
import {
  Box, Typography, Chip, Divider, IconButton,
  Checkbox, Button, Modal, Backdrop, Fade,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ChevronDownIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const FONT_UI   = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const DECISIONS = [
  {
    id: 1,
    action: "Reorder 240u",
    title: "Cotton tee navy L",
    sku: "CT-NAVY-L",
    category: "Apparel",
    context: "Stockout in 6 days · Vendor A lead time 4d · Cyber Monday in 10d",
    confidence: 94,
    amount: "$1,920",
    urgency: "Urgent",
    detail: {
      why: [
        "Stock 38u, velocity 6/day → stockout in 6 days",
        "Vendor A lead time 4 days, unit cost $8 (lowest qualified)",
        "Cyber Monday in 10d, forecast 2.3x normal",
        "240u covers 30 days post-promo at projected velocity",
      ],
      alternatives: [
        { title: "Wait 2 days, reorder from Vendor B", reason: "Rejected: lead time would cause 3-day stockout" },
        { title: "Reorder 180u from Vendor A", reason: "Rejected: covers only 22d post-promo" },
      ],
      trackRecord: {
        score: "4 / 5 right",
        history: [
          { date: "Mar 12", action: "Reorder 180u",       result: true,  note: "avoided stockout" },
          { date: "Feb 28", action: "Hold",                result: true,  note: "correct call, no spike" },
          { date: "Feb 14", action: "Reorder 200u",        result: true,  note: "promo absorbed" },
          { date: "Jan 31", action: "Switch to Vendor B",  result: false, note: "lead time slipped" },
          { date: "Jan 18", action: "Reorder 150u",        result: true,  note: "on target" },
        ],
      },
    },
  },
  {
    id: 2,
    action: "Switch vendor",
    title: "Hoodie black M",
    sku: "HD-BLK-M",
    category: "Apparel",
    context: "Vendor B 8d late · Vendor C ready · 3-day lead time saved",
    confidence: 71,
    amount: "$4,200",
    urgency: "Today",
    detail: {
      why: [
        "Vendor B PO #4821 delayed 8 days, no ETA update",
        "Vendor C has stock, same unit cost, 3-day lead time",
        "Switching avoids projected stockout by Nov 18",
        "Vendor C rated 4.7/5 on last 12 orders",
      ],
      alternatives: [
        { title: "Wait for Vendor B", reason: "Rejected: stockout risk during peak season" },
        { title: "Emergency air freight from Vendor B", reason: "Rejected: $1,200 excess cost vs switching" },
      ],
      trackRecord: {
        score: "3 / 5 right",
        history: [
          { date: "Mar 5",  action: "Reorder 300u", result: true,  note: "on target" },
          { date: "Feb 20", action: "Switch vendor", result: false, note: "Vendor C delayed" },
          { date: "Feb 1",  action: "Reorder 250u", result: true,  note: "promo covered" },
          { date: "Jan 25", action: "Hold",          result: false, note: "missed velocity spike" },
          { date: "Jan 10", action: "Reorder 200u", result: true,  note: "normal cycle" },
        ],
      },
    },
  },
  {
    id: 3,
    action: "Reorder 80u",
    title: "Beanie cream OS",
    sku: "BN-CRM-OS",
    category: "Accessories",
    context: "Promo in 12d · Vendor A · MOQ met at 80u",
    confidence: 88,
    amount: "$640",
    urgency: "This wk",
    detail: {
      why: [
        "Winter promo starts Nov 25, forecast +180% velocity",
        "Current stock 22u covers only 4 days at promo rate",
        "Vendor A MOQ is 80u, lead time 5 days",
        "80u covers promo window + 10-day buffer",
      ],
      alternatives: [
        { title: "Reorder 120u for larger buffer", reason: "Rejected: over-budget, low sell-through risk post-promo" },
        { title: "Skip reorder, monitor promo",    reason: "Rejected: stockout probability 91% within 6 days of promo" },
      ],
      trackRecord: {
        score: "5 / 5 right",
        history: [
          { date: "Mar 10", action: "Reorder 80u",  result: true, note: "promo covered exactly" },
          { date: "Feb 22", action: "Reorder 60u",  result: true, note: "normal sell-through" },
          { date: "Feb 8",  action: "Hold",          result: true, note: "no promo, correct" },
          { date: "Jan 28", action: "Reorder 80u",  result: true, note: "holiday absorbed" },
          { date: "Jan 5",  action: "Reorder 100u", result: true, note: "end of season clearance" },
        ],
      },
    },
  },
  {
    id: 4,
    action: "Reorder 60u",
    title: "Tote canvas natural",
    sku: "TT-NAT-OS",
    category: "Bags",
    context: "Low confidence: limited sales history (28d)",
    confidence: 52,
    amount: "$480",
    urgency: "This wk",
    detail: {
      why: [
        "Only 28 days of sales data — velocity estimate uncertain",
        "Current stock 14u, if velocity holds, stockout in 9 days",
        "Vendor A has availability, lead time 6 days",
        "60u is conservative order to avoid overstock",
      ],
      alternatives: [
        { title: "Wait 7 more days for better data", reason: "Rejected: risks stockout before reorder arrives" },
        { title: "Reorder 100u",                     reason: "Rejected: too aggressive with limited demand signal" },
      ],
      trackRecord: {
        score: "2 / 3 right",
        history: [
          { date: "Mar 18", action: "Reorder 60u", result: true,  note: "sold through" },
          { date: "Mar 2",  action: "Reorder 80u", result: false, note: "overstock, 30u remaining" },
          { date: "Feb 15", action: "Hold",         result: true,  note: "correct, slow week" },
        ],
      },
    },
  },
];

// ── Helpers ───────────────────────────────────────────────
const confidenceColor = (c) =>
  c >= 85 ? "#4caf50" : c >= 65 ? "#ff9800" : "#f44336";

const confidenceBg = (c) =>
  c >= 85 ? "rgba(76,175,80,0.12)" : c >= 65 ? "rgba(255,152,0,0.12)" : "rgba(244,67,54,0.12)";

const urgencyStyle = (u) => ({
  Urgent:    { bg: "rgba(244,67,54,0.15)",  color: "#f44336" },
  Today:     { bg: "rgba(255,152,0,0.15)",  color: "#ff9800" },
  "This wk": { bg: "rgba(74,138,255,0.15)", color: "#4a8aff" },
}[u] || { bg: "rgba(255,255,255,0.08)", color: "#888" });

// ── Badges ────────────────────────────────────────────────
const ConfidenceBadge = ({ value }) => (
  <Box sx={{
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    px: 1, py: 0.3, borderRadius: "6px",
    backgroundColor: confidenceBg(value),
    border: `1px solid ${confidenceColor(value)}33`,
    color: confidenceColor(value),
    fontSize: 11, fontWeight: 700, fontFamily: FONT_MONO, minWidth: 44,
  }}>
    {value}%
  </Box>
);

const UrgencyBadge = ({ label }) => {
  const s = urgencyStyle(label);
  return (
    <Box sx={{
      px: 1, py: 0.3, borderRadius: "6px",
      backgroundColor: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, fontFamily: FONT_UI,
      letterSpacing: "0.02em", whiteSpace: "nowrap",
    }}>
      {label}
    </Box>
  );
};

// ── Detail Modal ──────────────────────────────────────────
const DetailModal = ({ decision, onClose, onAction }) => {
  if (!decision) return null;

  const { detail, confidence } = decision;
  const confidenceLabel =
    confidence >= 85 ? "High confidence" : confidence >= 65 ? "Medium confidence" : "Low confidence";
  const confidenceNote =
    confidence >= 85 ? "Aria can act alone above 85%" :
    confidence >= 65 ? "Review recommended" : "Human review required";

  return (
    <Modal
      open={!!decision}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 200, sx: { backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" } } }}
    >
      <Fade in={!!decision} timeout={200}>
        <Box sx={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "92vw", sm: 600 },
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0d0d0d",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
          overflow: "hidden",
          fontFamily: FONT_UI,
          outline: "none",
        }}>
          {/* Header */}
          <Box sx={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between",
            px: 2.5, pt: 2.5, pb: 2,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#fff", lineHeight: 1.25, mb: 0.4 }}>
                {decision.title}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "#555", fontFamily: FONT_MONO }}>
                {decision.sku} · {decision.category}
              </Typography>
            </Box>
            <IconButton size="small" onClick={onClose}
              sx={{ color: "#444", p: 0.4, ml: 1, "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.06)" } }}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {/* Scrollable body */}
          <Box sx={{
            flex: 1, overflowY: "auto", px: 2.5, py: 2,
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.08)", borderRadius: 2 },
          }}>
            {/* Confidence box */}
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              p: 1.5, borderRadius: "10px", mb: 2.5,
              backgroundColor: confidenceBg(confidence),
              border: `1px solid ${confidenceColor(confidence)}33`,
            }}>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: confidenceColor(confidence), fontFamily: FONT_MONO }}>
                {confidence}%
              </Typography>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: confidenceColor(confidence) }}>
                  {confidenceLabel}
                </Typography>
                <Typography sx={{ fontSize: 11, color: confidenceColor(confidence), opacity: 0.7 }}>
                  {confidenceNote}
                </Typography>
              </Box>
            </Box>

            {/* Why */}
            <Typography sx={{ fontSize: 10, fontWeight: 600, fontFamily: FONT_MONO, color: "#444", letterSpacing: "0.1em", mb: 1.25 }}>
              WHY ARIA RECOMMENDS THIS
            </Typography>
            <Box sx={{ mb: 2.5 }}>
              {detail.why.map((item, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1.5, mb: 0.9 }}>
                  <Box sx={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#4a8aff", mt: "7px", flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12.5, color: "#bbb", lineHeight: 1.6 }}>{item}</Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 2 }} />

            {/* Alternatives */}
            <Typography sx={{ fontSize: 10, fontWeight: 600, fontFamily: FONT_MONO, color: "#444", letterSpacing: "0.1em", mb: 1.25 }}>
              ALTERNATIVES CONSIDERED
            </Typography>
            <Box sx={{ mb: 2.5 }}>
              {detail.alternatives.map((alt, i) => (
                <Box key={i} sx={{
                  mb: 1.25, p: 1.5, borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#ddd", mb: 0.3 }}>{alt.title}</Typography>
                  <Typography sx={{ fontSize: 11, color: "#555" }}>{alt.reason}</Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mb: 2 }} />

            {/* Track record */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.25 }}>
              <Typography sx={{ fontSize: 10, fontWeight: 600, fontFamily: FONT_MONO, color: "#444", letterSpacing: "0.1em" }}>
                ARIA'S TRACK RECORD
              </Typography>
              <Box sx={{ px: 1, py: 0.3, borderRadius: "6px", backgroundColor: "rgba(76,175,80,0.12)", border: "1px solid rgba(76,175,80,0.2)" }}>
                <Typography sx={{ fontSize: 11, color: "#4caf50", fontWeight: 700, fontFamily: FONT_MONO }}>
                  {detail.trackRecord.score}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 1 }}>
              {detail.trackRecord.history.map((h, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 0.75 }}>
                  {h.result
                    ? <CheckIcon  sx={{ fontSize: 13, color: "#4caf50", mt: "2px", flexShrink: 0 }} />
                    : <CancelIcon sx={{ fontSize: 13, color: "#f44336", mt: "2px", flexShrink: 0 }} />
                  }
                  <Typography sx={{ fontSize: 11.5, color: "#666", fontFamily: FONT_MONO }}>
                    <span style={{ color: "#444" }}>{h.date} · </span>
                    {h.action}
                    <span style={{ color: "#3a3a3a" }}> · {h.note}</span>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{
            px: 2.5, py: 2,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: 1,
            background: "rgba(0,0,0,0.3)",
          }}>
            <Button fullWidth variant="outlined" onClick={() => onAction("modify", decision.id)}
              sx={{ fontFamily: FONT_UI, borderColor: "rgba(255,255,255,0.12)", color: "#aaa", textTransform: "none", fontWeight: 500, fontSize: 13, borderRadius: "8px",
                "&:hover": { borderColor: "rgba(255,255,255,0.3)", color: "#fff", backgroundColor: "rgba(255,255,255,0.04)" } }}>
              Modify
            </Button>
            <Button fullWidth variant="outlined" onClick={() => onAction("reject", decision.id)}
              sx={{ fontFamily: FONT_UI, borderColor: "rgba(244,67,54,0.3)", color: "#f44336", textTransform: "none", fontWeight: 500, fontSize: 13, borderRadius: "8px",
                "&:hover": { borderColor: "#f44336", backgroundColor: "rgba(244,67,54,0.06)" } }}>
              Reject
            </Button>
            <Button fullWidth variant="contained" onClick={() => onAction("approve", decision.id)}
              sx={{ fontFamily: FONT_UI, backgroundColor: "#fff", color: "#000", textTransform: "none", fontWeight: 700, fontSize: 13, borderRadius: "8px",
                "&:hover": { backgroundColor: "#e0e0e0" } }}>
              Approve
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

// ── Decision Card ─────────────────────────────────────────
const DecisionCard = ({ decision, isSelected, onSelect, onOpen }) => (
  <Box
    sx={{
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "12px",
      backgroundColor: "rgba(255,255,255,0.02)",
      mb: 1.5, transition: "all 0.15s", cursor: "pointer",
      fontFamily: FONT_UI,
      "&:hover": { borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.035)" },
    }}
    onClick={() => onOpen(decision)}
  >
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Checkbox
          checked={isSelected}
          onChange={(e) => { e.stopPropagation(); onSelect(decision.id); }}
          onClick={(e) => e.stopPropagation()}
          size="small"
          sx={{ p: 0, mt: "2px", color: "rgba(255,255,255,0.2)", "&.Mui-checked": { color: "#4a8aff" } }}
        />
        <Box sx={{ width: 40, height: 40, borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.3 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#bbb" }}>
              {decision.action} —{" "}
              <span style={{ color: "#fff", fontWeight: 600 }}>{decision.title}</span>
            </Typography>
            <Box sx={{
              px: 0.7, py: 0.15, borderRadius: "4px",
              backgroundColor: "rgba(255,255,255,0.07)", color: "#555",
              fontSize: 10, fontWeight: 500, fontFamily: FONT_MONO, letterSpacing: "0.04em",
            }}>
              {decision.sku}
            </Box>
          </Box>
          <Typography sx={{ fontSize: 11.5, color: "#555", mb: 1, lineHeight: 1.5 }}>
            {decision.context}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <ConfidenceBadge value={decision.confidence} />
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#ddd", fontFamily: FONT_MONO }}>
              {decision.amount}
            </Typography>
            <UrgencyBadge label={decision.urgency} />
            <Box sx={{ ml: "auto" }}>
              <IconButton size="small" sx={{ color: "#444", p: 0.3, "&:hover": { color: "#fff" } }}>
                <ChevronDownIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

// ── Main Component ────────────────────────────────────────
export default function DecisionReview({ onBack }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedIds,  setSelectedIds]  = useState([]);
  const [openDecision, setOpenDecision] = useState(null);
  const [dismissed,    setDismissed]    = useState([]);

  const filters = [
    { key: "all",    label: `All ${DECISIONS.length}` },
    { key: "high",   label: "High >85%" },
    { key: "medium", label: "Medium" },
    { key: "low",    label: "Low <60%" },
    { key: "vendor", label: "By vendor" },
  ];

  const filteredDecisions = DECISIONS.filter((d) => {
    if (dismissed.includes(d.id)) return false;
    if (activeFilter === "high")   return d.confidence >= 85;
    if (activeFilter === "medium") return d.confidence >= 60 && d.confidence < 85;
    if (activeFilter === "low")    return d.confidence < 60;
    return true;
  });

  const totalImpact = filteredDecisions.reduce(
    (sum, d) => sum + parseInt(d.amount.replace(/[$,]/g, "")), 0
  );

  const toggleSelect = (id) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const selectAll = () =>
    setSelectedIds(
      selectedIds.length === filteredDecisions.length ? [] : filteredDecisions.map((d) => d.id)
    );

  const handleAction = (action, id) => {
    setDismissed((prev) => [...prev, id]);
    setOpenDecision(null);
  };

  const handleBulkAction = (action, threshold) => {
    const targets = filteredDecisions.filter((d) =>
      action === "approve" ? d.confidence > threshold : d.confidence < threshold
    );
    setDismissed((prev) => [...prev, ...targets.map((d) => d.id)]);
    setOpenDecision(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: FONT_UI }}>

      {/* Top bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <IconButton size="small" onClick={onBack}
          sx={{ color: "#555", p: 0.5, "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.06)" } }}>
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.2, fontFamily: FONT_UI }}>
            Decision queue
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#555", fontFamily: FONT_UI }}>
            {filteredDecisions.length} awaiting review · ${totalImpact.toLocaleString()} total impact
          </Typography>
        </Box>
      </Box>

      {/* Filter chips */}
      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 2 }}>
        {filters.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            onClick={() => setActiveFilter(f.key)}
            size="small"
            sx={{
              fontSize: 12, height: 28, fontFamily: FONT_UI,
              backgroundColor: activeFilter === f.key ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeFilter === f.key ? "#fff" : "#555",
              border: `1px solid ${activeFilter === f.key ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.07)", color: "#ddd" },
              cursor: "pointer",
            }}
          />
        ))}
      </Box>

      {/* Bulk actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", "&:hover span": { color: "#fff" } }}
          onClick={selectAll}
        >
          <Checkbox
            checked={selectedIds.length === filteredDecisions.length && filteredDecisions.length > 0}
            indeterminate={selectedIds.length > 0 && selectedIds.length < filteredDecisions.length}
            size="small"
            sx={{ p: 0, color: "rgba(255,255,255,0.2)", "&.Mui-checked": { color: "#4a8aff" }, "&.MuiCheckbox-indeterminate": { color: "#4a8aff" } }}
          />
          <Typography component="span" sx={{ fontSize: 12, color: "#555", fontFamily: FONT_UI, transition: "color 0.15s" }}>
            Select all
          </Typography>
        </Box>
        <Button size="small" variant="outlined" onClick={() => handleBulkAction("approve", 90)}
          sx={{ fontFamily: FONT_UI, fontSize: 11, textTransform: "none", fontWeight: 500, borderColor: "rgba(76,175,80,0.3)", color: "#4caf50", height: 26, borderRadius: "7px",
            "&:hover": { borderColor: "#4caf50", backgroundColor: "rgba(76,175,80,0.06)" } }}>
          Approve all &gt;90%
        </Button>
        <Button size="small" variant="outlined" onClick={() => handleBulkAction("reject", 50)}
          sx={{ fontFamily: FONT_UI, fontSize: 11, textTransform: "none", fontWeight: 500, borderColor: "rgba(244,67,54,0.3)", color: "#f44336", height: 26, borderRadius: "7px",
            "&:hover": { borderColor: "#f44336", backgroundColor: "rgba(244,67,54,0.06)" } }}>
          Reject all &lt;50%
        </Button>
      </Box>

      {/* Cards list */}
      <Box sx={{
        flex: 1, overflowY: "auto",
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: 2 },
      }}>
        {filteredDecisions.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ fontSize: 14, color: "#444", fontFamily: FONT_UI }}>
              All decisions resolved
            </Typography>
          </Box>
        ) : (
          filteredDecisions.map((d) => (
            <DecisionCard
              key={d.id}
              decision={d}
              isSelected={selectedIds.includes(d.id)}
              onSelect={toggleSelect}
              onOpen={setOpenDecision}
            />
          ))
        )}
      </Box>

      {/* Modal popup */}
      <DetailModal
        decision={openDecision}
        onClose={() => setOpenDecision(null)}
        onAction={handleAction}
      />
    </Box>
  );
}