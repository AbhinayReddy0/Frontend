import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Chip,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

// ── constants ──────────────────────────────────────────────────────────────────
const USER_NAME = "John";
const USER_INITIAL = "J";

const SUGGESTIONS = [
  { icon: "🔗", text: "How do I connect a store?" },
  { icon: "📦", text: "How do I view my inventory?" },
  { icon: "📋", text: "How do I manage my orders?" },
  { icon: "🚚", text: "How do I set up shipping?" },
  { icon: "📊", text: "How do I generate a report?" },
  { icon: "📍", text: "How do I track my shipments?" },
];

// ── Q&A map (steps as HTML strings — no JSX outside components) ───────────────
const QA_MAP = {
  "how do i connect a store": {
    intro: "To connect a store to Atheera:",
    steps: [
      'Go to the <b>Integrations</b> page from the left sidebar.',
      'Browse available platforms (Shopify, Amazon, WooCommerce, etc.) and click <b>Connect</b> on the one you want.',
      'Fill in the required details — your store URL, API key, and access password.',
      'Click <b>Save & Connect</b>. Inventory and orders will sync automatically within minutes.',
    ],
  },
  "how do i view my inventory": {
    intro: "To view and manage your inventory:",
    steps: [
      'Open the <b>Dashboard</b> — you\'ll see a real-time stock overview at the top.',
      'Click the <b>Inventory</b> tab in the sidebar for the full product list.',
      'Use the filter bar to narrow by warehouse, SKU, category, or stock status.',
      'Low-stock items are <b>highlighted automatically</b> so you can reorder before running out.',
    ],
  },
  "how do i manage my orders": {
    intro: "To manage orders across all your channels:",
    steps: [
      'Go to <b>Orders</b> from the main left-side menu.',
      'All orders from connected stores appear here in one unified view.',
      'Click any order to open its detail panel — update status, print labels, or issue refunds.',
      'Use the <b>Filters</b> bar to search by date, channel, status, or customer name.',
    ],
  },
  "how do i set up shipping": {
    intro: "To configure shipping and fulfilment:",
    steps: [
      'Go to <b>Integrations</b> and connect your fulfilment partner (e.g. ShipBob, ShipStation).',
      'Once linked, shipping rates, carriers, and tracking are pulled in automatically.',
      'Head to <b>Settings → Shipping Rules</b> to automate carrier selection by weight or destination.',
      'Enable customer <b>shipping notifications</b> under Settings → Notifications.',
    ],
  },
  "how do i generate a report": {
    intro: "To generate a sales or inventory report:",
    steps: [
      'Navigate to <b>Reports</b> in the left sidebar.',
      'Choose the report type — Sales Performance, Inventory Summary, or Fulfilment Breakdown.',
      'Select your date range and any channel or product filters you need.',
      'Click <b>Generate</b>. Export as <b>CSV or PDF</b> when ready.',
    ],
  },
  "how do i track my shipments": {
    intro: "To track shipments in real time:",
    steps: [
      'Open the <b>Orders</b> page and find the order you want to track.',
      'Click the <b>tracking number</b> in the order row — this opens live carrier status.',
      'View all in-transit shipments under the <b>Shipments</b> sub-page inside Orders.',
      'Enable <b>customer tracking notifications</b> under Settings → Notifications.',
    ],
  },
};

// ── helpers ────────────────────────────────────────────────────────────────────
const normalize = (str) => str.toLowerCase().trim().replace(/[?!.]/g, "");

const getAnswer = (query) => {
  const q = normalize(query);
  for (const key in QA_MAP) {
    if (q === key || q.includes(key)) return QA_MAP[key];
  }
  return null;
};

// ── TypingIndicator ────────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", px: 2 }}>
    <Avatar sx={{ width: 30, height: 30, bgcolor: "#4f46e5", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
      A
    </Avatar>
    <Box
      sx={{
        bgcolor: "#111",
        border: "1px solid #1e1e1e",
        borderRadius: "4px 12px 12px 12px",
        px: 2,
        py: 1.5,
        display: "flex",
        gap: "5px",
        alignItems: "center",
      }}
    >
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "#6366f1",
            animation: "blink 1.2s infinite",
            animationDelay: `${i * 0.2}s`,
            "@keyframes blink": {
              "0%,80%,100%": { opacity: 0.2 },
              "40%": { opacity: 1 },
            },
          }}
        />
      ))}
    </Box>
  </Box>
);

// ── MessageBubble ──────────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        px: 2,
        animation: "fadeUp 0.25s ease",
        "@keyframes fadeUp": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "none" },
        },
      }}
    >
      <Avatar
        sx={{
          width: 30,
          height: 30,
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
          mt: 0.3,
          bgcolor: isUser ? "#18181b" : "#4f46e5",
          border: isUser ? "1px solid #27272a" : "none",
          color: isUser ? "#a1a1aa" : "#fff",
        }}
      >
        {isUser ? USER_INITIAL : "A"}
      </Avatar>

      <Box
        sx={{
          maxWidth: "76%",
          bgcolor: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: isUser ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
          px: 2.5,
          py: 1.75,
        }}
      >
        {/* User plain-text */}
        {typeof msg.content === "string" && (
          <Typography fontSize={14} color="#d1d5db" lineHeight={1.75}>
            {msg.content}
          </Typography>
        )}

        {/* Assistant — structured QA */}
        {msg.content?.steps && (
          <>
            <Typography
              fontSize={11}
              fontWeight={600}
              color="#6366f1"
              letterSpacing="0.06em"
              textTransform="uppercase"
              mb={1}
            >
              Step-by-step
            </Typography>
            <Typography fontSize={14} color="#d1d5db" lineHeight={1.75} mb={1}>
              {msg.content.intro}
            </Typography>
            <Box
              component="ol"
              sx={{ pl: 2.5, display: "flex", flexDirection: "column", gap: 0.75 }}
            >
              {msg.content.steps.map((step, i) => (
                <Box
                  component="li"
                  key={i}
                  sx={{
                    fontSize: 13.5,
                    color: "#c4c4cc",
                    lineHeight: 1.7,
                    "& b": { color: "#a78bfa", fontWeight: 500 },
                  }}
                  dangerouslySetInnerHTML={{ __html: step }}
                />
              ))}
            </Box>
          </>
        )}

        {/* Assistant — fallback */}
        {msg.content?.fallback && (
          <Typography fontSize={14} color="#d1d5db" lineHeight={1.75}>
            {msg.content.fallback}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// ── InputBar ───────────────────────────────────────────────────────────────────
const InputBar = ({ input, setInput, onSend, onKey, placeholder }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      bgcolor: "#111",
      border: "1px solid #222",
      borderRadius: "12px",
      px: 2,
      py: 1.25,
      gap: 1.5,
      transition: "border-color 0.2s",
      "&:focus-within": { borderColor: "#4f46e5" },
    }}
  >
    <Box sx={{ color: "#3f3f46", display: "flex", alignItems: "center", flexShrink: 0 }}>
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Box>

    <TextField
      fullWidth
      placeholder={placeholder}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={onKey}
      variant="standard"
      sx={{
        "& .MuiInputBase-root": {
          color: "#e4e4e7",
          fontSize: 14,
          "&:before, &:after": { display: "none" },
        },
        "& .MuiInputBase-input::placeholder": { color: "#3f3f46", opacity: 1 },
      }}
    />

    {input.trim() && (
      <IconButton
        onClick={onSend}
        size="small"
        sx={{
          bgcolor: "#4f46e5",
          color: "#fff",
          borderRadius: "8px",
          width: 30,
          height: 30,
          flexShrink: 0,
          "&:hover": { bgcolor: "#4338ca" },
        }}
      >
        <SendIcon sx={{ fontSize: 14 }} />
      </IconButton>
    )}
  </Box>
);

// ── AssistantPage ──────────────────────────────────────────────────────────────
const AssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isEmpty = messages.length === 0;

  const sendMessage = (text) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText, id: Date.now() },
    ]);
    setLoading(true);

    setTimeout(() => {
      const answer = getAnswer(userText);
      const assistantContent = answer ?? {
        fallback: `I can only answer common Atheera questions right now. For "${userText}", please contact support or visit the Help Center.`,
      };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantContent, id: Date.now() + 1 },
      ]);
      setLoading(false);
    }, 850);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", bgcolor: "#0a0a0a", color: "#fff" }}>

      {/* ── header (chat active only) ── */}
      {!isEmpty && (
        <Box sx={{ px: 3, py: 1.75, borderBottom: "1px solid #161616", display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Box>
          <Typography fontSize={13} fontWeight={500} color="#71717a">
            Atheera Assistant &nbsp;·&nbsp;{" "}
            <Box component="span" sx={{ color: "#a1a1aa" }}>{USER_NAME}</Box>
          </Typography>
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#22c55e" }} />
            <Typography fontSize={11} color="#3f3f46">Online</Typography>
          </Box>
        </Box>
      )}

      {/* ── scroll area ── */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "#222", borderRadius: "99px" },
        }}
      >
        {isEmpty ? (
          /* ── landing / empty state ── */
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              px: 3,
              py: 5,
              maxWidth: 560,
              mx: "auto",
              width: "100%",
            }}
          >
            {/* logo */}
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Box>

            {/* greeting */}
            <Box sx={{ textAlign: "center" }}>
              <Typography fontSize={22} fontWeight={600} color="#f4f4f5">
                How can I help you, {USER_NAME}?
              </Typography>
              <Typography fontSize={13} color="#52525b" mt={0.5}>
                Pick a question below to know about the Atheera
              </Typography>
            </Box>

            {/* search bar */}
            <Box sx={{ width: "100%" }}>
              <InputBar
                input={input}
                setInput={setInput}
                onSend={() => sendMessage()}
                onKey={handleKey}
                placeholder="Type what you need…"
              />
            </Box>

            {/* suggestion chips — below search bar */}
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, width: "100%" }}>
              {SUGGESTIONS.map((item, idx) => (
                <Chip
                  key={idx}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Box component="span" sx={{ fontSize: 13 }}>{item.icon}</Box>
                      <Box component="span" sx={{ fontSize: 12.5 }}>{item.text}</Box>
                    </Box>
                  }
                  onClick={() => sendMessage(item.text)}
                  sx={{
                    bgcolor: "#111",
                    color: "#a1a1aa",
                    border: "1px solid #1e1e1e",
                    borderRadius: "10px",
                    height: 34,
                    px: 0.5,
                    "& .MuiChip-label": { px: 1 },
                    "&:hover": { bgcolor: "#131325", borderColor: "#4f46e5", color: "#e4e4e7" },
                  }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          /* ── chat messages ── */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 3 }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={endRef} />
          </Box>
        )}
      </Box>

      {/* ── persistent input bar (chat active) ── */}
      {!isEmpty && (
        <Box sx={{ px: 2, pb: 2, pt: 1.5, borderTop: "1px solid #161616" }}>
          <InputBar
            input={input}
            setInput={setInput}
            onSend={() => sendMessage()}
            onKey={handleKey}
            placeholder="Ask me anything about Atheera…"
          />
        </Box>
      )}
    </Box>
  );
};

export default AssistantPage;