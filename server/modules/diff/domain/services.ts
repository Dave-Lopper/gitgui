import { ChangedLine, ContextLine, Hunk } from "./entities";

export function parseFileNumStat(line: string): number[] {
  const matches = line.trimEnd().match(/^([\d-]+)\s+([\d-]+)\s+(.+)$/);
  if (!matches) {
    throw new Error(`Numstat line unexpectedly formed: ${line}`);
  }

  const [, added, removed, _] = matches;
  return [parseInt(added), parseInt(removed)];
}

type HunkPart = {
  addedLines: ChangedLine[];
  removedLines: ChangedLine[];
  trailingContext: ContextLine[];
};

export function parseFileDiff(diff: string): Hunk[] {
  const hunks: Hunk[] = [];
  const rawHunks = diff.split(/(^@@ -\d+,\d+ \+\d+,\d+ @@ .*$)/m).slice(1);

  for (let i = 0; i < rawHunks.length; i += 2) {
    const rawHunk = rawHunks[i];
    const rawHunkDiff = rawHunks[i + 1];
    const hunkMatch = rawHunk.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@ (.*$)/m);
    if (!hunkMatch) {
      throw new Error(`Diff hunk line unexpectedly formed: ${rawHunk}`);
    }

    const [
      ,
      rawOldLineStart,
      rawOldLineCount,
      rawNewLineStart,
      rawNewLineCount,
      enclosingBlock,
    ] = hunkMatch;

    const oldLineStart = parseInt(rawOldLineStart);
    const oldLineCount = parseInt(rawOldLineCount);
    const newLineStart = parseInt(rawNewLineStart);
    const newLineCount = parseInt(rawNewLineCount);

    const currentHunk: Hunk = {
      oldLineCount,
      oldLineStart,
      newLineCount,
      newLineStart,
      enclosingBlock,
      lines: [],
    };
    let currentHunkPart: HunkPart = {
      addedLines: [],
      removedLines: [],
      trailingContext: [],
    };

    const flushHunkPart = () => {
      currentHunk.lines = [
        ...currentHunk.lines,
        ...currentHunkPart.removedLines,
        ...currentHunkPart.addedLines,
        ...currentHunkPart.trailingContext,
      ];

      currentHunkPart = {
        addedLines: [],
        removedLines: [],
        trailingContext: [],
      };
    };

    const addLinePart = (
      mode: "ADDED" | "REMOVED",
      partType: "CONTEXT" | "DIFF",
      n: number,
      content: string,
    ) => {
      if (mode === "ADDED") {
        const addedLineIndex =
          currentHunkPart.addedLines.length > 0
            ? currentHunkPart.addedLines.length - 1
            : 0;

        if (currentHunkPart.addedLines[addedLineIndex]) {
          currentHunkPart.addedLines[addedLineIndex].parts.push({
            type: partType,
            content,
          });
        } else {
          currentHunkPart.addedLines[addedLineIndex] = {
            type: "ADDED",
            n,
            parts: [
              {
                type: partType,
                content,
              },
            ],
          };
        }
      } else {
        const removedLineIndex =
          currentHunkPart.removedLines.length > 0
            ? currentHunkPart.removedLines.length - 1
            : 0;

        if (currentHunkPart.removedLines[removedLineIndex]) {
          currentHunkPart.removedLines[removedLineIndex].parts.push({
            type: partType,
            content,
          });
        } else {
          currentHunkPart.removedLines[removedLineIndex] = {
            type: "REMOVED",
            n,
            parts: [
              {
                type: partType,
                content,
              },
            ],
          };
        }
      }
    };

    const rawLines = rawHunkDiff.split(/^~$/m);
    for (let k = 0; k < rawLines.length; k++) {
      const diffLine = rawLines[k];
      const diffLineParts = diffLine.split("\n").filter((part) => part);
      const nextRawLine = rawLines[k + 1];
      const nextRawLineParts = nextRawLine?.split("\n").filter((part) => part);

      let hasRemovedPart = false;
      let hasAddedPart = false;

      for (let l = 0; l < diffLineParts.length; l++) {
        if (diffLineParts[l].startsWith("+")) {
          hasAddedPart = true;
        } else if (diffLineParts[l].startsWith("-")) {
          hasRemovedPart = true;
        }
      }

      for (let l = 0; l < diffLineParts.length; l++) {
        const linePart = diffLineParts[l];

        if (hasAddedPart || hasRemovedPart) {
          if (linePart.startsWith("+")) {
            addLinePart("ADDED", "DIFF", newLineStart + k, linePart.slice(1));
          } else if (linePart.startsWith("-")) {
            addLinePart("REMOVED", "DIFF", oldLineStart + k, linePart.slice(1));
          } else {
            addLinePart(
              "ADDED",
              "CONTEXT",
              newLineStart + k,
              linePart.slice(1),
            );
            addLinePart(
              "REMOVED",
              "CONTEXT",
              oldLineStart + k,
              linePart.slice(1),
            );
          }
        } else {
          currentHunkPart.trailingContext.push({
            type: "CONTEXT",
            content: linePart.slice(1),
            oldN: oldLineStart + k,
            newN: newLineStart + k,
          });
        }
      }

      if (hasAddedPart) {
        currentHunkPart.addedLines.push({
          type: "ADDED",
          parts: [],
          n: newLineStart + k + 1,
        });
      }

      if (hasRemovedPart) {
        currentHunkPart.removedLines.push({
          type: "REMOVED",
          parts: [],
          n: oldLineStart + k + 1,
        });
      }

      if (
        nextRawLineParts?.length > 0 &&
        !nextRawLineParts?.some(
          (part) => part.startsWith("+") || part.startsWith("-"),
        )
      ) {
        flushHunkPart();
      }
    }
    hunks.push(currentHunk);
  }

  return hunks;
}

export function getOneSidedDiff(
  fileContents: string,
  status: "ADDED" | "REMOVED",
): Hunk {
  const lines = fileContents.split("\n");
  const hunk: Hunk = {
    oldLineCount: 0,
    oldLineStart: 0,
    newLineCount: lines.length,
    newLineStart: 1,
    lines: [],
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    hunk.lines.push({
      type: status,
      n: i + 1,
      parts: [{ type: "DIFF", content: line }],
    });
  }

  return hunk;
}
