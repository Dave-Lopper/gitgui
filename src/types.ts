export type Repository = {
  name: string;
  url: string;
  remoteName: string | undefined;
  lastFetchedAt: string | undefined;
  localPath: string;
  checkedOutBranch: string;
  branches: Branch[];
};

export type Branch = {
  name: string;
  isCurrent: boolean;
  isLocal: boolean;
  remote?: string;
};

export type RepositorySelection = {
  repository: Omit<Repository, "branches">;
  branches: Branch[];
  diff: FileDiff[];
};

export type GitError = {
  command?: string;
  message: string;
};

type DiffLineType = "context" | "added" | "removed";

export type DiffLine = {
  type: DiffLineType;
  content: string;
  oldLineNumber: number | null;
  newLineNumber: number | null;
};

export type DiffHunk = {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
};

export type FileDiff = {
  staged: boolean;
  oldPath: string;
  newPath: string;
  changeType: "modified" | "added" | "deleted" | "renamed";
  hunks: DiffHunk[];
};

export type Actiontype =
  | "CloneUrlInput"
  | "RepoMethodSelection"
  | "LocalRepoSelection"
  | "RemoteRepoSelection"
  | "BranchSelection";

export function getDiffFileName(diff: FileDiff): string {
  switch (diff.changeType) {
    case "deleted":
      return diff.oldPath;
    case "renamed":
      return `${diff.oldPath} -> ${diff.newPath}`;
    default:
      return diff.newPath;
  }
}
