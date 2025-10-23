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

function createEmptyLine(n: number): DiffLine {
  return {
    n,
    parts: [],
  };
}

function finalizeHunk(hunk: PartialHunk): DiffHunk {
  let addedPartsCount = 0;
  for (const addedLine of hunk.afterDiff) {
    for (const addedLinePart of addedLine.parts) {
      if (addedLinePart.status === "ADDED") {
        addedPartsCount += 1;
        break;
      }
      if (addedPartsCount > 0) {
        break;
      }
    }
  }
  if (addedPartsCount === 0) {
    hunk.afterDiff = [];
  }

  let removedPartsCount = 0;
  for (const removedLine of hunk.beforeDiff) {
    for (const removedLinePart of removedLine.parts) {
      if (removedLinePart.status === "REMOVED") {
        removedPartsCount += 1;
        break;
      }
      if (removedPartsCount > 0) {
        break;
      }
    }
  }
  if (removedPartsCount === 0) {
    hunk.beforeDiff = [];
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

export function parseDiff(diffLines: string[]): DiffFile[] {
  const files: DiffFile[] = [];

  let currentFile: PartialFile | undefined;
  let currentHunk: PartialHunk | undefined;
  let currentAfterLine: DiffLine | undefined;
  let currentBeforeLine: DiffLine | undefined;
  let currentAfterLineNumber: number | undefined;
  let currentBeforeLineNumber: number | undefined;
  let processedLineParts: Set<"REMOVED" | "ADDED" | "UNCHANGED"> = new Set();

  const flushLine = (lineType: "AFTER" | "BEFORE") => {
    if (lineType === "AFTER" && currentAfterLine && currentHunk) {
      currentAfterLineNumber = currentAfterLine.n;
      currentHunk.afterDiff.push(currentAfterLine);
      currentAfterLine = createEmptyLine(currentAfterLineNumber + 1);
    } else if (lineType === "BEFORE" && currentBeforeLine && currentHunk) {
      currentBeforeLineNumber = currentBeforeLine.n;
      currentHunk.beforeDiff.push(currentBeforeLine);
      currentBeforeLine = createEmptyLine(currentBeforeLineNumber + 1);
    }
  };

  const flushHunk = () => {
    flushLine("BEFORE");
    flushLine("AFTER");
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

      currentBeforeLine = createEmptyLine(currentHunk.oldStart);
      currentAfterLine = createEmptyLine(currentHunk.newStart);
    }
    // New line
    else if (currentDiffLine === "~") {
      const lastDiffLine = diffLines[i - 1];
      const nextDiffLine = diffLines[i + 1];

      if (lastDiffLine?.startsWith("-")) {
        flushLine("BEFORE");
      }

      if (lastDiffLine?.startsWith("+")) {
        flushLine("AFTER");
      }

      if (lastDiffLine?.startsWith(" ")) {
        flushLine("BEFORE");
        flushLine("AFTER");
      }

      if (nextDiffLine?.startsWith(" ")) {
        flushLine("BEFORE");
        flushLine("AFTER");
      }

      processedLineParts = new Set();
      continue;
    }
    // Removed line part
    else if (currentDiffLine.startsWith("-")) {
      if (currentBeforeLine) {
        const content = currentDiffLine.slice(1);
        processedLineParts.add("REMOVED");
        currentBeforeLine.parts.push({
          content,
          status: "REMOVED",
        });
      }
    }
    // Added line part
    else if (currentDiffLine.startsWith("+")) {
      if (currentAfterLine) {
        const content = currentDiffLine.slice(1);
        processedLineParts.add("ADDED");
        currentAfterLine.parts.push({
          content,
          status: "ADDED",
        });
      }
    }
    // Unchanged line part
    else {
      processedLineParts.add("UNCHANGED");
      if (currentBeforeLine) {
        currentBeforeLine.parts.push({
          content: currentDiffLine.slice(1),
          status: "UNCHANGED",
        });
      }
      if (currentAfterLine) {
        currentAfterLine.parts.push({
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
