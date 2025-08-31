export type Repository = {
  checkedOutBranch?: string;
  lastFetchedAt?: Date;
  localPath: string;
  name: string;
  remoteName?: string;
  url?: string;
};

export type Branch = {
  isCurrent: boolean;
  isLocal: boolean;
  name: string;
  remote: string | undefined;
};

export const modTypes = ["UNTRACKED", "MODIFIED", "ADDED", "REMOVED"] as const;
export type ModType = (typeof modTypes)[number];
export type ChangedFile = {
  path: string;
  modType: ModType;
};
