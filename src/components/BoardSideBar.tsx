import { useBingoEvent } from "@/contexts/BingoEventContext";
import type { Board } from "@/types/bingoEvent.schema";
import { v4 as uuidv4 } from 'uuid';

/**
 * Sidebar component for managing bingo boards.
 * 
 * Features:
 * - Add a new board
 * - Select a board to view/edit
 * - Delete a board
 */
export default function BoardSidebar() {
    const { boards, selectBoardIndex, selectedBoardIndex, addBoardHandler, deleteBoardHandler } = useBingoEvent();
    // TODO: 
    // - focus handler
    // - delete modal?

    return (
        <section className="w-full h-full flex flex-col md:border-r-[0.6px] bg-sidebar-black">
            <div className="p-4 space-y-4 w-full">
                {/* Button to add a new board */}
                <button
                    className="w-full p-2 bg-card-black rounded hover:bg-highlight-grey"
                    onClick={() => {
                        const emtpyBoard: Board = {
                            golden_tile: [],
                            quests: [],
                            rewards: [],
                        };
                        addBoardHandler(emtpyBoard);
                    }}
                >
                    + Add Board
                </button>

                {/* List of existing boards */}
                <ul className="space-y-2 overflow-y-auto max-h-[60vh]">
                    {boards.map((_, index) => (
                        <li className={`flex rounded group ${selectedBoardIndex === index ? "bg-highlight-grey": ""}`} key={uuidv4()}>
                            {/* Button to select a board */}
                            <button
                                className={`w-full p-2 text-left group-hover:bg-card-black hover:cursor-pointer`}
                                onClick={() => {
                                    selectBoardIndex(index);
                                }}
                            >
                                <span className="sr-only">Select board</span>
                                Board {index + 1}
                            </button>

                            {/* Button to delete a board, shown on hover */}
                            <button 
                                className="px-2 hidden group-hover:bg-card-black group-hover:inline-block hover:cursor-pointer"
                                onClick={() => {
                                    deleteBoardHandler(index);
                                }}
                            >
                                <span className="sr-only">Delete board</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5V4h3a.75.75 0 0 1 0 1.5h-.5v7A2.5 2.5 0 0 1 10 15H6a2.5 2.5 0 0 1-2.5-2.5v-7H3A.75.75 0 1 1 3 4h3v-.5ZM6.75 6a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0V6Zm4 0a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0V6Z" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
