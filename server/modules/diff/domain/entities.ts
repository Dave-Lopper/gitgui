export type LinePart = {
  type: "DIFF" | "CONTEXT";
  content: string;
};

export type ContextLine = {
  oldN: number;
  newN: number;
  content: string;
  type: "CONTEXT";
};

const lineStatuses = ["ADDED", "REMOVED"] as const;
export type ChangedLineStatus = (typeof lineStatuses)[number];

export type ChangedLine = {
  type: ChangedLineStatus;
  n: number;
  parts: LinePart[];
};

export type Hunk = {
  enclosingBlock?: string;
  oldLineCount: number;
  oldLineStart: number;
  newLineCount: number;
  newLineStart: number;
  lines: (ChangedLine | ContextLine)[];
};

const fileStatuses = ["ADDED", "REMOVED", "MODIFIED", "MOVED"] as const;
export type FileStatus = (typeof fileStatuses)[number];

export type FileInfos = {
  addedLines: number;
  path: string;
  removedLines: number;
  staged: boolean;
  status: FileStatus;
};

export type File = FileInfos & {
  hunks: Hunk[];
};

export type DiffEntry = {
  addedLines: number;
  removedLines: number;
  hunks: Hunk[];
};
