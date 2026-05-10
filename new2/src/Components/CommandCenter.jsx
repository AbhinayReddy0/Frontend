import { useState } from "react";
import { Box } from "@mui/material";
import GreetingBanner from "./GreetingBanner";
import DecisionReview from "./DecisionReview";
import AgentPulse from "./AgentPulse";
import DecisionsSummary from "./DecisionsSummary";
import AriaActivityCard from "./AriaActivityCard";

export default function CommandCenter() {
    const [view, setView] = useState("home"); // "home" | "decisions"

    return (
        <Box sx={{ flex: 1, height: "100%", overflowY: "auto", px: 3, py: 2.5, bgcolor: "#080808" }}>
            {view === "home" && (
                <>
                    <GreetingBanner onReview={() => setView("decisions")} />
                    <AgentPulse />
                    <DecisionsSummary onOpenQueue={() => setView("decisions")} />
                    <AriaActivityCard />
                </>
            )}
            {view === "decisions" && (
                <DecisionReview onBack={() => setView("home")} />
            )}
        </Box>
    );
}