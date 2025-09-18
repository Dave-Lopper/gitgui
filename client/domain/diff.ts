const diffFileStatuses = ["ADDED", "REMOVED", "MODIFIED", "MOVED"] as const;
export type DiffFileStatus = (typeof diffFileStatuses)[number];

const diffLinePartStatus = ["ADDED", "REMOVED", "UNCHANGED"] as const;
export type DiffLinePartStatus = (typeof diffLinePartStatus)[number];

export type DiffLinePart = {
  content: string;
  status: DiffLinePartStatus;
};

export type DiffLine = {
  oldN: number;
  newN: number;
  parts: DiffLinePart[];
};

export type DiffHunk = {
  enclosingBlock?: string;
  oldLineStart: number;
  oldLineCount: number;
  newLineStart: number;
  newLineCount: number;
  beforeDiff: DiffLine[];
  afterDiff: DiffLine[];
};

export type CurrentDiffFile = {
  oldPath: string | null;
  newPath: string | null;
  status: DiffFileStatus;
  displayPaths: string[];
  hunks: DiffHunk[];
  staged: boolean;
};

export function getFilePath(file: CurrentDiffFile): string {
  if (["ADDED", "MODIFIED", "MOVED"].includes(file.status)) {
    if (!file.newPath) {
      throw new Error(
        "Unexepctedly missing newPath on an ADDED/MODIFIED/MOVED file",
      );
    }
    return file.newPath;
  } else {
    if (!file.newPath) {
      throw new Error("Unexepctedly missing oldPath on an REMOVED file");
    }
    return file.oldPath!;
  }
}

export type PastDiffFile = CurrentDiffFile & { staged: boolean };
