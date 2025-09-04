import { z } from "zod";

// For simplicity sake I just matched the keys with the snake case ones in the dummy json.
export const GoldenTileSchema = z.object({
    quest_position: z.number(),
    reward_id: z.string(),
    reward_quantity: z.number(),
    reward_type: z.string(),
    spotlight: z.boolean()
});

export const QuestSchema = z.object({
    area: z.string(),
    quantity: z.number(),
    render: z.string(),
    target: z.string(),
    target_type: z.string(),
    type: z.string()
});

export const RewardSchema = z.object({
    id: z.string(),
    quantity: z.number(),
    type: z.string(),
});

export const BoardSchema = z.object ({
    golden_tile: z.array(GoldenTileSchema).default([]),
    quests: z.array(QuestSchema).default([]),
    rewards: z.array(RewardSchema).default([])
});

export const TitleSchema = z.object({
    language_id: z.string(),
    translation: z.string()
});

// Top level schema
export const EventDataSchema = z.object({
    boards: z.array(BoardSchema),
    theme: z.string(),
    title: z.array(TitleSchema)
});

export type Board = z.infer<typeof BoardSchema>;
export type Quest = z.infer<typeof QuestSchema>;
export type Reward = z.infer<typeof RewardSchema>;
export type GoldenTile = z.infer<typeof GoldenTileSchema>;
export type Title = z.infer<typeof TitleSchema>;
// export the top level schema as a type to use
export type EventData = z.infer<typeof EventDataSchema>;
// for data tables
// export type Row = Quest | Reward | GoldenTile | Title;
// export type Section = 'quests' | 'rewards' | 'golden_tile';