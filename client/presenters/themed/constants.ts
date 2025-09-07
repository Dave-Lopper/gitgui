export const THEMES = ["MODERN", "RETRO"] as const;
export type Theme = (typeof THEMES)[number];
