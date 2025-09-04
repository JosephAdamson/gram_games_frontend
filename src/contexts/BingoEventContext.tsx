import { createContext, useContext, useState, useEffect } from "react";
import { useFetchBingoEventData } from "@/hooks/useFetchBingoEventData";
import {
    type Board,
    type Title,
    type Quest,
    type GoldenTile,
    type Reward,
} from "@/types/bingoEvent.schema";

interface BingoEventContext {
    boards: Board[];
    theme: string;
    titles: Title[];
    selectedBoardIndex: number | null;
    selectBoardIndex: (index: number) => void;
    updateBoardHandler: (index: number, newBoard: Board) => void;
    addBoardHandler: (board: Board) => void;
    deleteBoardHandler: (index: number) => void;
    setThemeHandler: (theme: string) => void;
    handleTitleTableCellChange: (
        rowIndex: number,
        columnId: keyof Title,
        value: string
    ) => void;
    deleteBoardRowHandler: (
        boardIndex: number,
        section: "quests" | "rewards" | "golden_tile",
        rowIndex: number
    ) => void;
    addBoardRowHandler: (boardIndex: number,
        section: "quests" | "rewards" | "golden_tile",
        newRow: Quest | Reward | GoldenTile) => void;
    updateBoardRowHandler: (boardIndex: number,
        section: "quests" | "rewards" | "golden_tile",
        rowIndex: number,
        newRow: Quest | Reward | GoldenTile) => void;
    loading: boolean;
    error: string | null;
    reset: () => void;
}

const BingoEventContext = createContext<BingoEventContext | null>(null);

/* 
Top level context provider for dashboard component. By lifting the data up into it's own
context, it could be accesible to other parts of the hypothetical system this dashoboard
would fit into. Plus, we avoid tedious prop drilling and we have a single source of truth
for our dashoboard.
*/
export function BingoEventProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { bingoEventData, loading, error, refetch } =
        useFetchBingoEventData();

    const [boards, setBoards] = useState<Board[]>([]);
    const [theme, setTheme] = useState<string>("");
    const [titles, setTitles] = useState<Title[]>([]);
    const [selectedBoardIndex, setSelectedBoardIndex] = useState<number | null>(
        null
    );

    /** Refetches all data from the server */
    const reset = () => {
        refetch();
    };

    //-------BOARDS--------
    const selectBoardIndex = (index: number) => {
        if (index >= 0 && index < boards.length) {
            setSelectedBoardIndex(index);
        }
    };

    const updateBoardHandler = (index: number, newBoard: Board) => {
        const newBoards = [...boards];
        newBoards[index] = newBoard;
        setBoards(newBoards);
    };

    const addBoardHandler = (board: Board) => {
        const newBoards = [...boards];
        newBoards.push(board);
        setBoards(newBoards);
    };

    const deleteBoardHandler = (index: number) => {
        if (index >= 0 && index < boards.length) {
            const newBoards = boards.filter((_, i) => i !== index);
            setBoards(newBoards);
            setSelectedBoardIndex(newBoards.length ? 0 : null);
        }
    };

    //--------TABLES-------
    function deleteBoardRowHandler(
        boardIndex: number,
        section: "quests" | "rewards" | "golden_tile",
        rowIndex: number
    ) {
        setBoards((prev) => {
            const newBoards = [...prev];
            const updatedBoard = { ...newBoards[boardIndex] };

            if (section === "quests") {
                updatedBoard.quests = updatedBoard.quests.filter(
                    (_, i) => i !== rowIndex
                );
            } else if (section === "rewards") {
                updatedBoard.rewards = updatedBoard.rewards.filter(
                    (_, i) => i !== rowIndex
                );
            } else if (section === "golden_tile") {
                updatedBoard.golden_tile = updatedBoard.golden_tile.filter(
                    (_, i) => i !== rowIndex
                );
            }

            newBoards[boardIndex] = updatedBoard;
            return newBoards;
        });
    }

    function addBoardRowHandler(
        boardIndex: number,
        section: "quests" | "rewards" | "golden_tile",
        newRow: Quest | Reward | GoldenTile
    ) {
        setBoards((prev) => {
            const newBoards = [...prev];
            const updatedBoard = { ...newBoards[boardIndex] };

            if (section === "quests") {
                updatedBoard.quests = [...updatedBoard.quests, newRow as Quest];
            } else if (section === "rewards") {
                updatedBoard.rewards = [
                    ...updatedBoard.rewards,
                    newRow as Reward,
                ];
            } else if (section === "golden_tile") {
                updatedBoard.golden_tile = [
                    ...updatedBoard.golden_tile,
                    newRow as GoldenTile,
                ];
            }

            newBoards[boardIndex] = updatedBoard;
            return newBoards;
        });
    }

    function updateBoardRowHandler(
        boardIndex: number,
        section: "quests" | "rewards" | "golden_tile",
        rowIndex: number,
        newRow: Quest | Reward | GoldenTile
    ) {
        setBoards((prevBoards) => {
            if (boardIndex < 0 || boardIndex >= prevBoards.length) {
                return prevBoards;
            }

            const newBoards = [...prevBoards];
            const updatedBoard = { ...newBoards[boardIndex] };
            // quests, golden tiles, rewards that need updating
            if (section === "quests") {
                updatedBoard.quests[rowIndex] = newRow as Quest;
            } else if (section === "rewards") {
                updatedBoard.rewards[rowIndex] = newRow as Reward;
            } else if (section === "golden_tile") {
                updatedBoard.golden_tile[rowIndex] = newRow as GoldenTile;
            }

            newBoards[boardIndex] = updatedBoard;
            return newBoards;
        });
    }

    //--------------------------

    //--------THEME/TITLE-------
    const setThemeHandler = (theme: string) => {
        if (theme !== null) {
            setTheme(theme);
        }
    };

    const handleTitleTableCellChange = (
        rowIndex: number,
        columnId: keyof Title,
        value: string
    ) => {
        console.log(value);
        setTitles((prevTitles) => {
            const newTitles = [...prevTitles];
            newTitles[rowIndex] = { ...newTitles[rowIndex], [columnId]: value };
            return newTitles;
        });
    };

    useEffect(() => {
        if (bingoEventData) {
            setBoards(bingoEventData["boards"]);
            setTheme(bingoEventData["theme"]);
            setTitles(bingoEventData["title"]);
            setSelectedBoardIndex(0);
        }
    }, [bingoEventData]);

    return (
        <BingoEventContext.Provider
            value={{
                boards,
                theme,
                titles,
                selectedBoardIndex,
                selectBoardIndex,
                updateBoardHandler,
                addBoardHandler,
                deleteBoardHandler,
                setThemeHandler,
                handleTitleTableCellChange,
                deleteBoardRowHandler,
                addBoardRowHandler,
                updateBoardRowHandler,
                loading,
                error,
                reset,
            }}
        >
            {children}
        </BingoEventContext.Provider>
    );
}

export function useBingoEvent() {
    const context = useContext(BingoEventContext);
    if (!context) {
        throw new Error(
            "useBingoEvent must be used inside the scope of BingoEventProvider"
        );
    }
    return context;
}
