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
