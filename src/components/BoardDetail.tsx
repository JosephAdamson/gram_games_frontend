import { useBingoEvent } from "@/contexts/BingoEventContext";
import {
    EditableTable,
    createNumberColumn,
    createStringColumn,
    createDeleteColumn,
    createBooleanStringColumn,
} from "./EditableTable";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
    QuestSchema,
    RewardSchema,
    GoldenTileSchema,
    BoardSchema,
    type Board,
} from "@/types/bingoEvent.schema";

/**
 * Component responsible for rendering the details of a single bingo board.
 * Provides a section to toggle between quests, rewards, and golden tile tables.
 * Integrates EditableTable for editing, deleting, and adding rows.
 */
export default function BoardDetail() {
    // All the top-level keys of a board, used for toggle buttons
    const toggleOptions: (keyof Board)[] = Object.keys(
        BoardSchema.shape
    ) as (keyof Board)[];

    const {
        boards,
        selectedBoardIndex,
        deleteBoardRowHandler,
        addBoardRowHandler,
        updateBoardRowHandler
    } = useBingoEvent();

    const [boardToggleDisplay, setBoardToggleDisplay] =
        useState<keyof Board>("quests");

    /**
     * Wrapper function handles deletion of a row from the current table section.
     * Calls the context-provided deleteBoardRowHandler with appropriate board and section.
     *
     * @param rowIndex - Index of the row to delete
     */
    const deleteRowHandler = (rowIndex: number) => {
        if (selectedBoardIndex === null) return;
        deleteBoardRowHandler(selectedBoardIndex, boardToggleDisplay, rowIndex);
    };

    const cellCommitHandler = <T extends object>(
        rowIndex: number,
        columnId: keyof T,
        value: any
    ) => {
        if (selectedBoardIndex === null) return;

        const board = boards[selectedBoardIndex];
        const section = boardToggleDisplay;
        const newRow = { ...board[section][rowIndex], [columnId]: value };

        updateBoardRowHandler(selectedBoardIndex, section, rowIndex, newRow);
    };

    /**
     * Wrapper function handles adding a new row to the current table section.
     * Creates a default row based on the schema for the current section.
     */
    const addRowHandler = () => {
        if (selectedBoardIndex === null) return;

        let newRow: any = {}; // can be empty or default values
        const schema =
            boardToggleDisplay === "quests"
                ? QuestSchema
                : boardToggleDisplay === "rewards"
                ? RewardSchema
                : GoldenTileSchema;

        // populate newRow with default values from schema
        Object.keys(schema.shape).forEach((key) => {
            newRow[key] = "";
        });

        addBoardRowHandler(selectedBoardIndex, boardToggleDisplay, newRow);
    };

    /**
     * Generates column definitions for EditableTable based on the provided schema.
     * Automatically creates delete, string, and number columns.
     *
     * @param schema - The schema object defining the keys and types of the data
     * @returns An array of ColumnDef objects suitable for EditableTable
     */
    function createColumns<T extends object>(schema: Record<string, any>) {
        const columnHelper = createColumnHelper<T>();
        const keys = Object.keys(schema) as (keyof T & string)[];
        const columns: ColumnDef<T, any>[] = [];

        // Add delete column
        columns.push(createDeleteColumn(columnHelper, deleteRowHandler));

        // Add remaining columns based on schema
        for (let key of keys) {
            if (
                key === "quantity" ||
                key === "reward_quantity" ||
                key === "quest_position"
            ) {
                columns.push(
                    createNumberColumn(columnHelper, key, key, cellCommitHandler)
                );
            } else if (key === "spotlight") {
                columns.push(
                    createBooleanStringColumn(columnHelper, key, key, cellCommitHandler)
                );
            } else {
                columns.push(
                    createStringColumn(columnHelper, key, key, cellCommitHandler)
                );
            }
        }

        return columns;
    }

    return (
        <section className="grow p-4 flex flex-col w-full">
            <div className="flex gap-10">
                <h2 className="text-lg md:text-xl font-semibold pt-1">
                    {selectedBoardIndex !== null
                        ? `Board ${selectedBoardIndex + 1}`
                        : "Select a board"}
                </h2>

                {/* Section toggle buttons */}
                <div className="flex flex-wrap gap-2 pb-2">
                    {toggleOptions.map((option) => (
                        <button
                            key={option}
                            className={`px-3 py-2 rounded hover: ${
                                boardToggleDisplay === option
                                    ? "bg-primary-btn-select text-white font-semibold hover:brightness-90"
                                    : "bg-card-black hover:bg-highlight-grey "
                            }`}
                            onClick={() => setBoardToggleDisplay(option)}
                        >
                            {option.charAt(0).toUpperCase() +
                                option.slice(1).replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 w-full">
                {boards && selectedBoardIndex !== null ? (
                    <>
                        {boardToggleDisplay === "quests" && (
                            <EditableTable
                                data={boards[selectedBoardIndex].quests}
                                columns={createColumns(QuestSchema.shape)}
                                onChange={() => {}}
                                onAddRow={addRowHandler}
                            />
                        )}
                        {boardToggleDisplay === "rewards" && (
                            <EditableTable
                                data={boards[selectedBoardIndex].rewards}
                                columns={createColumns(RewardSchema.shape)}
                                onChange={() => {}}
                                onAddRow={addRowHandler}
                            />
                        )}
                        {boardToggleDisplay === "golden_tile" && (
                            <EditableTable
                                data={boards[selectedBoardIndex].golden_tile}
                                columns={createColumns(GoldenTileSchema.shape)}
                                onChange={() => {}}
                                onAddRow={addRowHandler}
                            />
                        )}
                    </>
                ) : (
                    <p className="text-gray-400">No board selected.</p>
                )}
            </div>
        </section>
    );
}
