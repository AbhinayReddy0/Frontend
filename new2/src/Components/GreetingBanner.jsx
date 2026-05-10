import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function GreetingBanner({ onReview }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: "14px",
        px: 3,
        py: 2.5,
        mb: 3,
      }}
    >
      <Box>
        <Typography
          sx={{ fontSize: 17, fontWeight: 700, color: "#fff", mb: 0.4 }}
        >
          {getGreeting()}, Sarah
        </Typography>
        <Typography sx={{ fontSize: 13.5, color: "#888" }}>
          Aria handled 14 decisions overnight. 12 need your review.
        </Typography>
      </Box>

      <Button
        onClick={onReview}
        endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
        sx={{
          bgcolor: "#4a8aff",
          color: "#000",
          fontWeight: 600,
          fontSize: 13.5,
          px: 2.5,
          py: 1.2,
          borderRadius: "10px",
          textTransform: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          ml: 3,
          "&:hover": { bgcolor: "#3567C7" },
        }}
      >
        Review decisions
      </Button>
    </Box>
  );
}