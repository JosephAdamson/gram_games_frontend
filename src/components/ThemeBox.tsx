import { useBingoEvent } from "@/contexts/BingoEventContext";
import { useState } from "react";

/**
 * ThemeBox component
 *
 * Displays the current Bingo event theme and allows inline editing.
 */
export default function ThemeBox() {
    const { theme, setThemeHandler } = useBingoEvent();
    const [isEditingTheme, setIsEditingTheme] = useState<boolean>(false);

    return (
        <section className="w-full min-w-screen-xl mx-auto flex flex-col gap-2 p-4">
            <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-base md:text-lg font-semibold">
                    Theme:
                    {isEditingTheme ? (
                        <input
                            className="ml-2"
                            type="text"
                            value={theme}
                            onChange={(e) => {
                                console.log(e.target.value);
                                setThemeHandler(e.target.value);
                            }}
                            onBlur={() => setIsEditingTheme(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setIsEditingTheme(false);
                                }
                            }}
                        />
                    ) : (
                        <span
                            className="ml-2"
                            onClick={() => {
                                setIsEditingTheme(true);
                            }}
                        >
                            {theme}
                        </span>
                    )}
                </h2>
            </div>
        </section>
    );
}