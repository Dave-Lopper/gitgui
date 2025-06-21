export const modTypes = ["UNTRACKED", "MODIFIED", "ADDED", "REMOVED"] as const;
export type ModType = (typeof modTypes)[number];

export const actionTypes = ["REMOVED", "ADDED", "CONTEXT"] as const;
export type ActionType = (typeof actionTypes)[number];

export type ChangedFile = {
  path: string;
  modType: ModType;
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
  oldPath: string;
  newPath: string;
  changeType: "modified" | "added" | "deleted" | "renamed";
  hunks: DiffHunk[];
};

export type DiffChangeType = "modified" | "added" | "deleted" | "renamed";

export function splitDiffLinesByFile(diffLines: string[]): string[][] {
  const files: string[][] = [];
  let currentFile: string[] = [];
  for (let i = 0; i < diffLines.length; i++) {
    const line = diffLines[i];

    if (line.startsWith("diff --git")) {
      if (currentFile.length > 0) {
        files.push(currentFile);
      }

      currentFile = [line];
      continue;
    } else {
      currentFile.push(line);
    }
  }

  if (currentFile.length > 0) {
    files.push(currentFile);
  }
  return files;
}

export type FileInfos = {
  oldPath: string;
  newPath: string;
  changeType: DiffChangeType;
};

export type RawHunk = {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
};

export function splitFileDiffByHunk(lines: string[]): {
  file: FileInfos;
  hunks: RawHunk[];
} {
  let oldPath: string | undefined = undefined;
  let newPath: string | undefined = undefined;
  const hunks = [];
  let currentHunk;

  for (let i = 0; i < lines.length; i++) {
    const diffLine = lines[i];

    if (diffLine.startsWith("--- ")) {
      const path = diffLine.slice(4).trim();
      oldPath = path === "/dev/null" ? path : path.slice(2);
      continue;
    }

    if (diffLine.startsWith("+++ ")) {
      const path = diffLine.slice(4).trim();
      newPath = path === "/dev/null" ? path : path.slice(2);
      continue;
    }

    if (diffLine.startsWith("@@")) {
      const match = /@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/.exec(diffLine);
      if (match) {
        currentHunk = {
          oldStart: parseInt(match[1], 10),
          oldLines: parseInt(match[2] || "1", 10),
          newStart: parseInt(match[3], 10),
          newLines: parseInt(match[4] || "1", 10),
          lines: [] as string[],
        };
        hunks.push(currentHunk);
      }
      continue;
    }

    currentHunk?.lines.push(diffLine);
  }

  if (oldPath === undefined || newPath === undefined) {
    throw new Error(
      `Seemingly malformed git diff output, unable to find paths: ${lines.join("\r\n")}`,
    );
  }

  let changeType: DiffChangeType;
  if (oldPath === "/dev/null") {
    changeType = "added";
  } else if (newPath === "/dev/null") {
    changeType = "deleted";
  } else if (oldPath !== newPath) {
    changeType = "renamed";
  } else {
    changeType = "modified";
  }

  if (currentHunk?.lines.length) {
    hunks.push(currentHunk);
  }

  return {
    file: { oldPath, newPath, changeType },
    hunks,
  };
}

export function splitHunkLinesByLine(hunkLines: string[]): string[][] {
  const lines: string[][] = [];
  let currentLine: string[] = [];

  for (let i = 0; i < hunkLines.length; i++) {
    const hunkLine = hunkLines[i];
    if (hunkLine === "~") {
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = [];
    } else {
      currentLine.push(hunkLine);
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}

export function formatDiffLine(
  hunk: RawHunk,
  lineParts: string[],
  lineIdx: number,
): DiffLine {
  let formattedLine = "";
  let changeType: DiffLineType | undefined = undefined;
  const filteredLineParts = lineParts.filter((part) => part.trim());

  for (let l = 0; l < lineParts.length; l++) {
    const linePart = lineParts[l];
    let formattedLinePart = linePart.slice(1);

    if (lineParts.length > 1) {
      changeType = "added";
    } else if (lineParts[0].startsWith("+")) {
      changeType = "added";
    } else if (lineParts[0].startsWith("-")) {
      changeType = "removed";
    } else {
      changeType = "context";
    }

    if (linePart.startsWith("+") && filteredLineParts.length > 1) {
      formattedLinePart = `<+>${linePart.slice(1)}</+>`;
    } else if (linePart.startsWith("-") && filteredLineParts.length > 1) {
      formattedLinePart = `<->${linePart.slice(1)}</->`;
    }

    formattedLine = formattedLine + formattedLinePart;
  }

  if (!changeType) {
    throw new Error(`Could not get changeType for diff line ${lineParts}`);
  }

  return {
    oldLineNumber: hunk.oldStart + lineIdx,
    newLineNumber: hunk.newStart + lineIdx,
    type: changeType,
    content: formattedLine,
  };
}

export type FileDiffV2 = {};

export function parseDiff(diffLines: string[]) {
  const files = splitDiffLinesByFile(diffLines);
  const diffs: FileDiff[] = [];
  for (let i = 0; i < files.length; i++) {
    const { file, hunks } = splitFileDiffByHunk(files[i]);
    const diff: FileDiff = {
      oldPath: file.oldPath,
      newPath: file.newPath,
      changeType: file.changeType,
      hunks: [],
    };

    for (let j = 0; j < hunks.length; j++) {
      const hunk = hunks[j];
      const rawLines = splitHunkLinesByLine(hunk.lines);
      const formattedLines = rawLines.map((lineParts: string[], idx: number) =>
        formatDiffLine(hunk, lineParts, idx),
      );
      diff.hunks.push({
        oldStart: hunk.oldStart,
        oldLines: hunk.oldLines,
        newStart: hunk.newStart,
        newLines: hunk.newLines,
        lines: formattedLines,
      });
    }
    diffs.push(diff);
  }
  return diffs;
}
