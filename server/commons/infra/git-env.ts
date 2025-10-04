export const GITENV: Record<string, string> = {
  GIT_PAGER: "cat",
  GIT_TERMINAL_PROMPT: "0",
  PATH: process.env.PATH + ":/usr/bin",
} as const;
