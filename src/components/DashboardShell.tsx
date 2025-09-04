import { useState } from "react";
import ThemeBox from "@/components/ThemeBox";
import TitleBox from "./TitleBox";
import BoardSidebar from "@/components/BoardSideBar";
import BoardDetail from "@/components/BoardDetail";
import { useBingoEvent } from "@/contexts/BingoEventContext";

/**
 * DashboardShell component
 * 
 * Top-level layout for the Bingo Event dashboard. Handles:
 * - Top bar with reset and mobile sidebar toggle
 * - Responsive sidebar (mobile + desktop)
 * - Main content area displaying board details
 * - Theme and title box
 */
export default function DashboardShell() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const { reset } = useBingoEvent();

    return (
        <div className="h-screen w-screen flex flex-col text-dashboard-text">
            {/* Top bar */}
            <div className="w-full flex justify-between py-2 px-4 z-50 sticky top-0 border-b-[0.6px] bg-card-black">
                {/* Mobile sidebar toggle */}
                <button
                    aria-expanded={sidebarOpen}
                    aria-controls="board-sidebar"
                    className="md:hidden px-3 py-2 rounded bg-card-black hover:bg-highlight-grey "
                    onClick={() => setSidebarOpen(true)}
                >
                    boards
                </button>

                {/* Reset data button */}
                <button
                    className="px-3 py-2 rounded bg-inner-panel-grey hover:bg-red-400 hover:text-white"
                    onClick={reset}
                >
                    Reset Data
                </button>
            </div>

            {/* Main content */}
            <div className="flex w-full h-full bg-inner-panel-grey">
                {/* Mobile sidebar */}
                <div
                    className={`fixed md:hidden top-0 left-0 h-full w-64 bg-sidebar-black shadow transform transition-transform z-60 md:z-0
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="w-full flex justify-end p-2">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="h-full"
                        >
                            ✕
                        </button>
                    </div>
                    <BoardSidebar />
                </div>

                {/* Desktop sidebar */}
                <div className="hidden md:flex w-64 bg-white z-10">
                    <BoardSidebar />
                </div>

                {/* Main content area */}
                <div className="flex-1 w-full overflow-auto">
                    <ThemeBox />
                    <TitleBox />
                    <BoardDetail />
                </div>
            </div>

            {/* Theme management */}
            {/* <TitleBox /> */}
        </div>
    );
}
