import { useState, useEffect, useCallback } from "react";
import { EventDataSchema, type EventData } from "@/types/bingoEvent.schema";
import { z } from "zod";

// fetch our bingo event data.
export function useFetchBingoEventData() {
    const [bingoEventData, setBingoEventData] = useState<EventData | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // a bit of an optimization to stop unnecessary renders when passing this function
    // around to other components.
    const fetchBingoEventData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("/mock_data.json");
            const json = await response.json();
            // parse the type and validate with zod.
            const data = EventDataSchema.parse(json);

            setBingoEventData(data);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError("Valdation error: data does not match type schema");
                console.log(error.issues);
            } else if (error instanceof Error) {
                setError(`Data fetch error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBingoEventData();
        // Fetching once for now.
    }, []);

    return { bingoEventData, loading, error, refetch: fetchBingoEventData};
}
