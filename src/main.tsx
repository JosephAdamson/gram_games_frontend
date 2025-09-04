import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DashboardShell from "./components/DashboardShell";
import { BingoEventProvider } from "./contexts/BingoEventContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BingoEventProvider>
            <DashboardShell />
        </BingoEventProvider>
    </StrictMode>
);
