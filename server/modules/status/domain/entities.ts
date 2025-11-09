const fileStatuses = ["ADDED", "REMOVED", "MODIFIED", "MOVED"] as const;
export type FileStatus = (typeof fileStatuses)[number];

export type StatusEntry = {
  path: string;
  status: FileStatus;
  staged: boolean;
};

export type TreeStatus = {
  unpushedCommitsCount: number;
  unpulledCommitsCount: number;
  entries: StatusEntry[];
};
