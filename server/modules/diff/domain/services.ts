import {
  DiffFile,
  DiffFileStatus,
  DiffHunk,
  DiffLine,
  DiffLinePart,
} from "./entities.js";

type PartialFile = {
  status?: DiffFileStatus;
  displayPaths: string[];
  oldPath?: string | null;
  newPath?: string | null;
  hunks: DiffHunk[];
};

type PartialHunk = {
  enclosingBlock?: string;
  oldLineCount?: number;
  oldStart?: number;
  newLineCount?: number;
  newStart?: number;
  beforeDiff: DiffLine[];
  afterDiff: DiffLine[];
  lines: DiffLine[];
};

type PartialLine = {
  parts: DiffLinePart[];
  oldN?: number;
  newN?: number;
};

function createEmptyFile(): PartialFile {
  return {
    displayPaths: [],
    hunks: [],
  };
}

function finalizeFile(file: PartialFile): DiffFile {
  let status: DiffFileStatus;
  let displayPaths: string[];

  if (file.oldPath === undefined || file.newPath === undefined) {
    throw new Error("Unexpectedly incomplete PartialFile");
  }

  if (file.oldPath === null) {
    status = "ADDED";
    displayPaths = [file.newPath!];
  } else if (file.newPath === null) {
    status = "REMOVED";
    displayPaths = [file.oldPath];
  } else if (file.oldPath === file.newPath) {
    status = "MODIFIED";
    displayPaths = [file.newPath];
  } else {
    status = "MOVED";
    displayPaths = [file.oldPath, file.newPath];
  }

  return {
    status,
    displayPaths,
    oldPath: file.oldPath!,
    newPath: file.newPath!,
    hunks: file.hunks,
  };
}

function createEmptyHunk(): PartialHunk {
  return {
    beforeDiff: [],
    afterDiff: [],
    lines: [],
  };
}

function finalizeHunk(hunk: PartialHunk): DiffHunk {
  for (const hunkLine of hunk.lines) {
    if (hunkLine.parts.some((part) => part.status === "REMOVED")) {
      hunk.beforeDiff.push({
        ...hunkLine,
        parts: hunkLine.parts.filter(
          (part) => part.status === "UNCHANGED" || part.status === "REMOVED",
        ),
      });
    }
    if (hunkLine.parts.some((part) => part.status === "ADDED")) {
      hunk.afterDiff.push({
        ...hunkLine,
        parts: hunkLine.parts.filter(
          (part) => part.status === "UNCHANGED" || part.status === "ADDED",
        ),
      });
    }
  }

  return {
    enclosingBlock: hunk.enclosingBlock,
    oldLineCount: hunk.oldLineCount!,
    oldLineStart: hunk.oldStart!,
    newLineCount: hunk.newLineCount!,
    newLineStart: hunk.newStart!,
    beforeDiff: hunk.beforeDiff,
    afterDiff: hunk.afterDiff,
  };
}

function finalizeLine(line: PartialLine): DiffLine {
  return {
    parts: line.parts,
    oldN: line.oldN!,
    newN: line.newN!,
  };
}

export function parseDiff(diffLines: string[]): DiffFile[] {
  const files: DiffFile[] = [];

  let currentFile: PartialFile | undefined;
  let currentHunk: PartialHunk | undefined;
  let currentLine: PartialLine | undefined;

  const flushLine = () => {
    if (currentLine && currentHunk) {
      currentHunk.lines.push(finalizeLine(currentLine));
      currentLine = undefined;
    }
  };

  const flushHunk = () => {
    flushLine();
    if (currentHunk && currentFile) {
      currentFile.hunks.push(finalizeHunk(currentHunk));
      currentHunk = undefined;
    }
  };

  const flushFile = () => {
    flushHunk();
    if (currentFile) {
      files.push(finalizeFile(currentFile));
      currentFile = undefined;
    }
  };

  for (let i = 0; i < diffLines.length; i++) {
    const currentDiffLine = diffLines[i];

    // New file
    if (currentDiffLine.startsWith("diff --git")) {
      flushFile();

      currentFile = createEmptyFile();
      const diffLineParts = currentDiffLine.split(" ");
      const oldPath = diffLineParts[2].slice(2);
      const newPath = diffLineParts[3].slice(2);
      currentFile.oldPath = oldPath === "/dev/null" ? null : oldPath;
      currentFile.newPath = newPath === "/dev/null" ? null : newPath;
    } else if (currentDiffLine.startsWith("index ")) {
      continue;
    }
    // New hunk
    else if (currentDiffLine.startsWith("@@")) {
      flushHunk();
      currentHunk = createEmptyHunk();

      const lineParts = currentDiffLine.split("@@");
      const hunkInfos = lineParts[1].trim();
      const [beforeLines, afterLines] = hunkInfos.split(" ");

      if (beforeLines.includes(",")) {
        currentHunk.oldStart = parseInt(beforeLines.split(",")[0].slice(1));
        currentHunk.oldLineCount = parseInt(beforeLines.split(",")[1]);
      } else {
        currentHunk.oldStart = parseInt(beforeLines.split(",")[0].slice(1));
        currentHunk.oldLineCount = 1;
      }

      if (afterLines.includes(",")) {
        currentHunk.newStart = parseInt(afterLines.split(",")[0].slice(1));
        currentHunk.newLineCount = parseInt(afterLines.split(",")[1]);
      } else {
        currentHunk.newStart = parseInt(afterLines.split(",")[0].slice(1));
        currentHunk.newLineCount = 1;
      }

      if (lineParts[2].trim() !== "") {
        currentHunk.enclosingBlock = lineParts[2].trim();
      }

      currentLine = {
        newN: currentHunk?.newStart!,
        oldN: currentHunk?.oldStart!,
        parts: [],
      };
    }
    // New line
    else if (currentDiffLine === "~") {
      if (currentLine && currentHunk) {
        currentHunk.lines.push(finalizeLine(currentLine));
        currentLine = {
          parts: [],
          oldN: currentLine.oldN! + 1,
          newN: currentLine.newN! + 1,
        };
      }
    }
    // Removed line part
    else if (currentDiffLine.startsWith("-")) {
      if (currentLine) {
        currentLine.parts.push({
          content: currentDiffLine.slice(1),
          status: "REMOVED",
        });
      }
    }
    // Added line part
    else if (currentDiffLine.startsWith("+")) {
      if (currentLine) {
        currentLine.parts.push({
          content: currentDiffLine.slice(1),
          status: "ADDED",
        });
      }
    }
    // Unchanged line part
    else {
      if (currentLine) {
        currentLine.parts.push({
          content: currentDiffLine.slice(1),
          status: "UNCHANGED",
        });
      }
    }
  }

  flushFile();
  return files;
}

export function getDiffFilePath(file: DiffFile): string {
  if (["ADDED", "MOVED", "MODIFIED"].includes(file.status)) {
    if (!file.newPath) {
      throw new Error("newPath unexpectedly null on ADDED/MOVED/MODIFIED file");
    }
    return file.newPath;
  } else {
    if (!file.oldPath) {
      throw new Error("oldPath unexpectedly null on REMOVED file");
    }
    return file.oldPath;
  }
}

export function parseStatus(statusLines: string[]): string[] {
  const addedFiles = [];

  for (let i = 0; i < statusLines.length; i++) {
    if (statusLines[i].startsWith("??")) {
      addedFiles.push(statusLines[i].split(" ").slice(1).join(" "));
    }
  }

  return addedFiles;
}

export function parseNewFileDiff(diffLines: string[]): DiffFile {
  const plusLine = diffLines.find((line) => line.startsWith("+++"));
  const minusLine = diffLines.find((line) => line.startsWith("---"));

  if (!plusLine || minusLine) {
    const partialFile: PartialFile = {
      status: "ADDED",
      displayPaths: [],
      hunks: [],
    };
    const diffLine = diffLines.find((line) => line.startsWith("diff --git a/"));
    if (!diffLine) {
      throw new Error("Neither +++/--- lines not diff line in added file diff");
    }
    const fileName = diffLine.split("b/").slice(1).join("b/");
    partialFile.oldPath = null;
    partialFile.newPath = fileName;
    partialFile.displayPaths = [fileName];
    partialFile.hunks = [];
    return finalizeFile(partialFile);
  }

  return parseDiff(diffLines)[0];
}
