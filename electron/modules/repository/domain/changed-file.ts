export const modTypes = ["UNTRACKED", "MODIFIED", "ADDED", "REMOVED"] as const;
export type ModType = (typeof modTypes)[number];

export type ChangedFile = {
  path: string;
  modType: ModType;
};
