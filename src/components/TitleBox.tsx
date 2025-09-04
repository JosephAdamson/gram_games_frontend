import { useBingoEvent } from "@/contexts/BingoEventContext";
import { useState } from "react";
import { EditableTable } from "./EditableTable";
import { createColumnHelper } from "@tanstack/react-table";
import type { Title } from "@/types/bingoEvent.schema";

/**
 * TitleBox component
 *
 * Displays a collapsible table of Title entries for the Bingo event.
 */
export default function TitleBox() {
    const { titles, handleTitleTableCellChange } = useBingoEvent();
    const [titleWindowOpen, setTitleWindowOpen] = useState<boolean>(false);

    // column definitions for Title
    const titleColumnHelper = createColumnHelper<Title>();

    const titleColumns = [
        titleColumnHelper.accessor("language_id", {
            header: "Language ID",
            cell: (info) => {
                const [languageId, setLangaugeId] = useState<string>(info.getValue());
                return (
                    <input
                        value={languageId}
                        onChange={(e) => setLangaugeId(e.target.value)}
                        onBlur={() => {
                            handleTitleTableCellChange(
                                info.row.index,
                                info.column.id as keyof Title,
                                languageId
                            );
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleTitleTableCellChange(
                                    info.row.index,
                                    info.column.id as keyof Title,
                                    languageId
                                );
                            }
                        }}
                        className=""
                    />
                );
            },
        }),

        titleColumnHelper.accessor("translation", {
            header: "Translation",
            cell: (info) => {
                const [translation, setTranslation] = useState<string>(info.getValue());
                return (
                    <input
                        value={translation}
                        onChange={(e) => setTranslation(e.target.value)}
                        onBlur={() => {
                            handleTitleTableCellChange(
                                info.row.index,
                                info.column.id as keyof Title,
                                translation
                            );
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleTitleTableCellChange(
                                    info.row.index,
                                    info.column.id as keyof Title,
                                    translation
                                );
                            }
                        }}
                        className=""
                    />
                );
            },
        }),
    ];

    return (
        <section className="w-full min-w-screen-xl mx-auto flex flex-col gap-2 px-4">
            <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-base md:text-lg font-semibold">Titles</h2>
                <button
                    className="hover:cursor-pointer h-full"
                    onClick={() => setTitleWindowOpen((prev) => !prev)}
                >
                    {titleWindowOpen ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="none"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill="currentColor"
                                d="M4.646 5.646a.5.5 0 0 1 .708 0L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="none"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill="currentColor"
                                d="M4.646 10.354a.5.5 0 0 0 .708 0L8 7.707l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"
                            />
                        </svg>
                    )}
                </button>
            </div>
            <div
                className={`overflow-y-auto transition-all linear duration-300 w-full md:w-1/2 ${
                    titleWindowOpen ? "max-h-60" : "max-h-0"
                }`}
            >
                {titles !== null && titleWindowOpen ? (
                    <EditableTable
                        data={titles}
                        columns={titleColumns}
                        // onChange={() => {}}
                    />
                ) : (
                    ""
                )}
            </div>
        </section>
    );
}