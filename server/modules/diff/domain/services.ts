import { ChangedLine, ContextLine, Hunk, LinePart } from "./entities.js";
import { myersDiff } from "./myers.js";

export function parseFileNumStat(line: string): number[] {
  const matches = line.trimEnd().match(/^([\d-]+)\s+([\d-]+)\s+(.+)$/);
  if (!matches) {
    throw new Error(`Numstat line unexpectedly formed: ${line}`);
  }

  const [, added, removed, _] = matches;
  return [parseInt(added), parseInt(removed)];
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

const diff = `commit 2ea7d65f2d1f040947a3af7c7351b2a4be3ce307
Author: Alexis Haim <alexishaim@outlook.fr>
Date:   Mon Oct 13 07:38:03 2025 +0700

    With functional branch checkout

diff --git a/server/modules/repository/application/use-cases/checkout-branch.ts b/server/modules/repository/application/use-cases/checkout-branch.ts
index 6c8c3c3..579d1a6 100644
--- a/server/modules/repository/application/use-cases/checkout-branch.ts
+++ b/server/modules/repository/application/use-cases/checkout-branch.ts
@@ -10,14 +10,18 @@ export class CheckoutBranch {
     private readonly repoDiffService: RepoDiffService,
~
   ) {}
~
 
~
   async 
-execute(repositoryPath:
+execute(
~
+    repositoryPath:
  string,
~
     branchName: 
-string):
+string,
~
+    remoteName?: string,
~
+  ):
  Promise<boolean> {
~
     const diff = await this.repoDiffService.execute(repositoryPath);
~
     if (diff.length > 0) {
~
       return false;
~
     }
~
 
~
     await safeGit(
~
       this.gitRunner.checkoutBranch(branchName, 
-repositoryPath),
+repositoryPath, remoteName),
~
       this.eventEmitter,
~
     );
~
     return true;
~`;

export function parseFileDiffOld(diff: string): Hunk[] {
  const hunks: Hunk[] = [];
  const rawHunks = diff.split(/(^@@ -\d+,\d+ \+\d+,\d+ @@ ?.*$)/m).slice(1);

  for (let i = 0; i < rawHunks.length; i += 2) {
    const rawHunk = rawHunks[i];
    const rawHunkDiff = rawHunks[i + 1];
    const hunkMatch = rawHunk.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@ ?(.*$)/m);
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

    const rawLines = rawHunkDiff.split(/^~$/m);
    for (let k = 0; k < rawLines.length; k++) {
      const diffLine = rawLines[k];
      const diffLineParts = diffLine.split("\n");

      let hasRemovedPart = false;
      let hasAddedPart = false;

      for (let l = 0; l < diffLineParts.length; l++) {
        if (diffLineParts[l].startsWith("+")) {
          hasAddedPart = true;
        } else if (diffLineParts[l].startsWith("-")) {
          hasRemovedPart = true;
        }
      }

      if (!hasAddedPart && !hasRemovedPart) {
        currentHunk.lines.push({
          type: "CONTEXT",
          content: diffLine.slice(0, -1).slice(1),
          oldN: oldLineStart + k,
          newN: newLineStart + k,
        });
        continue;
      }

      if (hasRemovedPart) {
        currentHunk.lines.push({
          type: "REMOVED",
          n: oldLineStart + k,
          parts: [],
        });
      }

      if (hasAddedPart) {
        currentHunk.lines.push({
          type: "ADDED",
          n: newLineStart + k,
          parts: [],
        });
      }

      for (let l = 0; l < diffLineParts.length; l++) {
        const linePart = diffLineParts[l];
        const lastLine = currentHunk.lines[currentHunk.lines.length - 1];

        let secondToLastLine = undefined;
        if (hasRemovedPart) {
          secondToLastLine = currentHunk.lines[currentHunk.lines.length - 2];
        }

        if (linePart.startsWith("+")) {
          if (lastLine.type !== "ADDED") {
            throw new Error(
              "Last currentHunk line is expected to be of ADDED type",
            );
          }
          lastLine.parts.push({
            type: "DIFF",
            content: linePart.slice(1),
          });
        } else if (linePart.startsWith("-")) {
          let lineToProcess: ChangedLine;
          if (hasAddedPart) {
            if (!secondToLastLine || secondToLastLine.type !== "REMOVED") {
              throw new Error(
                "Last currentHunk line is expected to be populated and of REMOVED type",
              );
            }
            lineToProcess = secondToLastLine;
          } else {
            if (!lastLine || lastLine.type !== "REMOVED") {
              throw new Error(
                "Last currentHunk line is expected to be populated and of REMOVED type",
              );
            }
            lineToProcess = lastLine;
          }
          lineToProcess.parts.push({
            type: "DIFF",
            content: linePart.slice(1),
          });
        } else {
          if (hasAddedPart) {
            if (!lastLine || lastLine.type !== "ADDED") {
              throw new Error(
                "Last currentHunk line is expected to be of ADDED type",
              );
            }
            lastLine.parts.push({
              type: "CONTEXT",
              content: linePart.slice(1),
            });
          }

          if (hasRemovedPart) {
            let lineToProcess: ChangedLine;
            if (hasAddedPart) {
              if (!secondToLastLine || secondToLastLine.type !== "REMOVED") {
                throw new Error(
                  "Last currentHunk line is expected to be populated and of REMOVED type",
                );
              }
              lineToProcess = secondToLastLine;
            } else {
              if (!lastLine || lastLine.type !== "REMOVED") {
                throw new Error(
                  "Last currentHunk line is expected to be populated and of REMOVED type",
                );
              }
              lineToProcess = lastLine;
            }
            lineToProcess.parts.push({
              type: "CONTEXT",
              content: linePart.slice(1),
            });
          }
        }
      }
    }
    hunks.push(currentHunk);
  }

  return hunks;
}

export function parseFileDiff(diff: string): Hunk[] {
  const hunks: Hunk[] = [];
  const rawHunks = diff.split(/(^@@ -\d+,\d+ \+\d+,\d+ @@ ?.*$)/m).slice(1);

  for (let i = 0; i < rawHunks.length; i += 2) {
    const rawHunk = rawHunks[i];
    const rawHunkDiff = rawHunks[i + 1];
    const hunkMatch = rawHunk.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@ ?(.*$)/m);
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

    let currentHunk: Hunk = {
      oldLineCount,
      oldLineStart,
      newLineCount,
      newLineStart,
      enclosingBlock,
      lines: [],
    };

    let currentHunkHasAddedPart = false;
    let currentHunkHasRemovedPart = false;

    const hunkRawLines = rawHunkDiff.split("\n");
    for (let j = 0; j < hunkRawLines.length; j++) {
      if (hunkRawLines[j].startsWith("-")) {
        currentHunkHasRemovedPart = true;
      }
      if (hunkRawLines[j].startsWith("+")) {
        currentHunkHasAddedPart = true;
      }

      if (currentHunkHasAddedPart && currentHunkHasRemovedPart) {
        break;
      }
    }

    const sourceLines = rawHunkDiff.split(/^~$/m);
    let currentAddedLineParts: LinePart[] = [];
    let currentRemovedLineParts: LinePart[] = [];
    let currentHunkLineIndex = 0;

    for (let j = 0; j < sourceLines.length; j++) {
      let sourceLineHasAddedPart = false;
      let sourceLineHasRemovedPath = false;

      const sourceLine = sourceLines[j];
      const sourceLineParts = sourceLine
        .split("\n")
        .filter((_) => _.length > 0);

      for (let k = 0; k < sourceLineParts.length; k++) {
        if (sourceLineParts[k].startsWith("+")) {
          sourceLineHasAddedPart = true;
        } else if (sourceLineParts[k].startsWith("-")) {
          sourceLineHasRemovedPath = true;
        }
      }

      for (let k = 0; k < sourceLineParts.length; k++) {
        const sourceLinePart = sourceLineParts[k];

        if (sourceLinePart.startsWith("+")) {
          currentAddedLineParts.push({
            type: "DIFF",
            content: sourceLinePart.slice(1),
          });
        } else if (sourceLinePart.startsWith("-")) {
          currentRemovedLineParts.push({
            type: "DIFF",
            content: sourceLinePart.slice(1),
          });
        } else if (sourceLinePart.startsWith(" ")) {
          if (sourceLineParts.length === 1) {
            currentHunk.lines.push({
              type: "CONTEXT",
              oldN: oldLineStart + j,
              newN: newLineStart + j,
              content: sourceLinePart.slice(1),
            });
            continue;
          }
          if (currentHunkHasAddedPart) {
            currentAddedLineParts.push({
              type: "CONTEXT",
              content: sourceLinePart.slice(1),
            });
          }
          if (currentHunkHasRemovedPart) {
            currentRemovedLineParts.push({
              type: "CONTEXT",
              content: sourceLinePart.slice(1),
            });
          }
        }
      }

      const lastLinePart = sourceLineParts[sourceLineParts.length - 1];
      if (sourceLineParts.length <= 1) {
        continue;
      }

      const nextSourceLine = sourceLines[j + 1];
      const nextSourceLineParts = nextSourceLine
        ?.split("\n")
        .filter((_) => _.length > 0);

      if (lastLinePart.startsWith(" ")) {
        if (
          nextSourceLine &&
          nextSourceLineParts.length === 1 &&
          nextSourceLineParts[0].startsWith(" ")
        ) {
          currentHunk.lines.push({
            type: "ADDED",
            n: newLineCount + j,
            parts: currentAddedLineParts,
          });
          currentAddedLineParts = [];
          currentHunk.lines.push({
            type: "REMOVED",
            n: oldLineStart + j,
            parts: currentRemovedLineParts,
          });
          currentRemovedLineParts = [];
        } else {
          if (sourceLineHasAddedPart) {
            currentHunk.lines.push({
              type: "ADDED",
              n: newLineCount + j,
              parts: currentAddedLineParts,
            });
            currentAddedLineParts = [];
          }
          if (sourceLineHasRemovedPath) {
            currentHunk.lines.push({
              type: "REMOVED",
              n: oldLineStart + j,
              parts: currentRemovedLineParts,
            });
            currentRemovedLineParts = [];
          }
        }
      } else if (lastLinePart.startsWith("+")) {
        currentHunk.lines.push({
          type: "ADDED",
          n: newLineCount + j,
          parts: currentAddedLineParts,
        });
        currentAddedLineParts = [];
      } else if (lastLinePart.startsWith("-")) {
        currentHunk.lines.push({
          type: "REMOVED",
          n: oldLineStart + j,
          parts: currentRemovedLineParts,
        });
        currentRemovedLineParts = [];
      }
    }

    hunks.push(currentHunk);
  }

  return hunks;
}

const rawPatch = `commit 2ea7d65f2d1f040947a3af7c7351b2a4be3ce307
Author: Alexis Haim <alexishaim@outlook.fr>
Date:   Mon Oct 13 07:38:03 2025 +0700

    With functional branch checkout

:100644 100644 6c8c3c3 579d1a6 M        server/modules/repository/application/use-cases/checkout-branch.ts

diff --git a/server/modules/repository/application/use-cases/checkout-branch.ts b/server/modules/repository/application/use-cases/checkout-branch.ts
index 6c8c3c3..579d1a6 100644
--- a/server/modules/repository/application/use-cases/checkout-branch.ts
+++ b/server/modules/repository/application/use-cases/checkout-branch.ts
@@ -10,14 +10,18 @@ export class CheckoutBranch {
     private readonly repoDiffService: RepoDiffService,
   ) {}
 
-  async execute(repositoryPath: string, branchName: string): Promise<boolean> {
+  async execute(
+    repositoryPath: string,
+    branchName: string,
+    remoteName?: string,
+  ): Promise<boolean> {
     const diff = await this.repoDiffService.execute(repositoryPath);
     if (diff.length > 0) {
       return false;
     }
 
     await safeGit(
-      this.gitRunner.checkoutBranch(branchName, repositoryPath),
+      this.gitRunner.checkoutBranch(branchName, repositoryPath, remoteName),
       this.eventEmitter,
     );
     return true;`;

type RawDiffLine = {
  type: "ADDED" | "REMOVED";
  n: number;
  content: string;
};

type RawContextLine = {
  type: "CONTEXT";
  newN: number;
  oldN: number;
  content: string;
};

type RawLine = RawContextLine | RawDiffLine;

type RawHunk = {
  enclosingBlock?: string;
  newLineCount: number;
  newLineStart: number;
  oldLineCount: number;
  oldLineStart: number;

  lines: RawLine[];
};

function parsePatch(patch: string): RawHunk[] {
  const hunks: RawHunk[] = [];
  const patchHunks = patch.split(/(^@@ -\d+,\d+ \+\d+,\d+ @@ ?.*$)/m).slice(1);

  for (let i = 0; i < patchHunks.length; i += 2) {
    const hunkHeader = patchHunks[i];
    const rawHunk = patchHunks[i + 1];

    const hunkMatch = hunkHeader.match(
      /@@ -(\d+),(\d+) \+(\d+),(\d+) @@ ?(.*$)/m,
    );
    if (!hunkMatch) {
      throw new Error(`Diff hunk line unexpectedly formed: ${hunkHeader}`);
    }

    const [
      ,
      oldLineStart,
      oldLineCount,
      newLineStart,
      newLineCount,
      enclosingBlock,
    ] = hunkMatch;

    const currentHunk: RawHunk = {
      newLineCount: parseInt(newLineCount),
      newLineStart: parseInt(newLineStart),
      oldLineCount: parseInt(oldLineCount),
      oldLineStart: parseInt(oldLineStart),
      enclosingBlock,
      lines: [],
    };

    const rawHunkLines = rawHunk.split("\n").slice(1);
    for (let j = 0; j < rawHunkLines.length; j++) {
      const hunkLine = rawHunkLines[j];

      if (hunkLine.startsWith(" ")) {
        currentHunk.lines.push({
          content: hunkLine.slice(1),
          newN: currentHunk.newLineStart + j,
          oldN: currentHunk.oldLineStart + j,
          type: "CONTEXT",
        });
        continue;
      }

      if (hunkLine.startsWith("+")) {
        currentHunk.lines.push({
          content: hunkLine.slice(1),
          n: currentHunk.newLineStart + j,
          type: "ADDED",
        });
      } else if (hunkLine.startsWith("-")) {
        currentHunk.lines.push({
          content: hunkLine.slice(1),
          n: currentHunk.oldLineStart + j,
          type: "REMOVED",
        });
      } else if (hunkLine === "") {
        continue;
      } else {
        console.warn(`Unexpected line start in raw patch ${hunkLine}`);
        continue;
      }
    }

    hunks.push(currentHunk);
  }

  return hunks;
}

type DiffBlock = {
  type: "UNCHANGED" | "ADDED" | "REMOVED" | "MODIFIED";
  oldLines: RawLine[];
  newLines: RawLine[];
};

type BlockedHunk = Omit<RawHunk, "lines"> & { blocks: DiffBlock[] };

function groupDiffBlocks(hunks: RawHunk[]): BlockedHunk[] {
  const blockedHunks: BlockedHunk[] = [];

  for (let i = 0; i < hunks.length; i++) {
    const hunk = hunks[i];
    const currentBlockedHunk: BlockedHunk = {
      enclosingBlock: hunk.enclosingBlock,
      newLineCount: hunk.newLineCount,
      newLineStart: hunk.newLineStart,
      oldLineCount: hunk.oldLineCount,
      oldLineStart: hunk.oldLineStart,
      blocks: [],
    };

    let j = 0;
    while (j < hunk.lines.length) {
      const line = hunk.lines[j];

      if (line.type === "CONTEXT") {
        currentBlockedHunk.blocks.push({
          type: "UNCHANGED",
          oldLines: [line],
          newLines: [line],
        });
        j++;
        continue;
      }

      const removed: RawLine[] = [];
      const added: RawLine[] = [];

      while (j < hunk.lines.length && hunk.lines[j].type === "REMOVED") {
        removed.push(hunk.lines[j++]);
      }
      while (j < hunk.lines.length && hunk.lines[j].type === "ADDED") {
        added.push(hunk.lines[j++]);
      }

      if (removed.length > 0 && added.length > 0) {
        currentBlockedHunk.blocks.push({
          type: "MODIFIED",
          oldLines: removed,
          newLines: added,
        });
      } else if (removed.length > 0) {
        currentBlockedHunk.blocks.push({
          type: "REMOVED",
          oldLines: removed,
          newLines: [],
        });
      } else if (added.length > 0) {
        currentBlockedHunk.blocks.push({
          type: "ADDED",
          oldLines: [],
          newLines: added,
        });
      }
    }

    blockedHunks.push(currentBlockedHunk);
  }

  return blockedHunks;
}

function computeWordDiffs(rawHunks: BlockedHunk[]): Hunk[] {
  const formattedHunks: Hunk[] = [];

  for (let i = 0; i < rawHunks.length; i++) {
    const rawHunk = rawHunks[i];
    const formattedHunk: Hunk = {
      enclosingBlock: rawHunk.enclosingBlock,
      newLineCount: rawHunk.newLineCount,
      newLineStart: rawHunk.newLineStart,
      oldLineCount: rawHunk.oldLineCount,
      oldLineStart: rawHunk.oldLineStart,
      lines: [],
    };
    let oldLineN = rawHunk.oldLineStart;
    let newLineN = rawHunk.newLineStart;

    for (let j = 0; j < rawHunk.blocks.length; j++) {
      const block = rawHunk.blocks[j];
      console.log("Processing block", { block });

      if (block.type === "UNCHANGED") {
        for (let k = 0; k < block.oldLines.length; k++) {
          formattedHunk.lines.push({
            type: "CONTEXT",
            oldN: oldLineN,
            newN: newLineN,
            content: block.oldLines[k].content,
          });
          oldLineN++;
          newLineN++;
        }
        continue;
      }

      if (block.type === "REMOVED") {
        for (let k = 0; k < block.oldLines.length; k++) {
          formattedHunk.lines.push({
            type: "REMOVED",
            n: newLineN,
            parts: [{ type: "CONTEXT", content: block.oldLines[k].content }],
          });
          oldLineN++;
        }
        continue;
      }

      if (block.type === "ADDED") {
        for (let k = 0; k < block.newLines.length; k++) {
          formattedHunk.lines.push({
            type: "ADDED",
            n: newLineN,
            parts: [{ type: "CONTEXT", content: block.newLines[k].content }],
          });
          newLineN++;
        }
        continue;
      }

      if (block.type === "MODIFIED") {
        if (block.oldLines.length === block.newLines.length) {
          for (let k = 0; k < block.oldLines.length; k++) {
            const edits = myersDiff(
              block.oldLines[k].content,
              block.newLines[k].content,
            );

            const removedLine: ChangedLine = {
              type: "REMOVED",
              n: oldLineN,
              parts: [],
            };
            const addedLine: ChangedLine = {
              type: "ADDED",
              n: newLineN,
              parts: [],
            };

            for (let l = 0; l < edits.length; l++) {
              const edit = edits[l];

              if (edit.type === "UNCHANGED") {
                removedLine.parts.push({
                  type: "CONTEXT",
                  content: edit.value,
                });
                addedLine.parts.push({
                  type: "CONTEXT",
                  content: edit.value,
                });
              } else if (edit.type === "ADDED") {
                addedLine.parts.push({
                  type: "DIFF",
                  content: edit.value,
                });
              } else {
                removedLine.parts.push({
                  type: "DIFF",
                  content: edit.value,
                });
              }
            }

            if (removedLine.parts.length > 0) {
              formattedHunk.lines.push(removedLine);
            }
            if (addedLine.parts.length > 0) {
              formattedHunk.lines.push(addedLine);
            }
            oldLineN++;
            newLineN++;
          }
        } else if (
          Math.max(block.oldLines.length, block.newLines.length) < 150
        ) {
          const oldText = block.oldLines.map((l) => l.content).join("\n");
          const newText = block.newLines.map((l) => l.content).join("\n");

          const edits = myersDiff(oldText, newText);
          const blockAddedLines: ChangedLine[] = [
            {
              type: "ADDED",
              n: oldLineN,
              parts: [],
            },
          ];
          const blockRemovedLines: ChangedLine[] = [
            {
              type: "REMOVED",
              n: oldLineN,
              parts: [],
            },
          ];

          for (let k = 0; k < edits.length; k++) {
            const edit = edits[k];
            let editValue = edit.value;

            while (editValue.length > 0) {
              const newLineIndex = editValue.indexOf("\n");
              if (newLineIndex === -1) {
                if (edit.type === "ADDED") {
                  blockAddedLines[blockAddedLines.length - 1].parts.push({
                    type: "DIFF",
                    content: editValue,
                  });
                } else if (edit.type === "REMOVED") {
                  blockRemovedLines[blockRemovedLines.length - 1].parts.push({
                    type: "DIFF",
                    content: editValue,
                  });
                } else {
                  blockRemovedLines[blockRemovedLines.length - 1].parts.push({
                    type: "DIFF",
                    content: editValue,
                  });
                  blockAddedLines[blockAddedLines.length - 1].parts.push({
                    type: "DIFF",
                    content: editValue,
                  });
                }

                break;
              }

              const breakIndex = editValue.indexOf("\n");
              const beforeBreak = editValue.substring(0, breakIndex);

              if (edit.type === "ADDED") {
                blockAddedLines[blockAddedLines.length - 1].parts.push({
                  type: "DIFF",
                  content: beforeBreak,
                });
                blockAddedLines.push({
                  type: "ADDED",
                  n: newLineN,
                  parts: [],
                });
                newLineN++;
              } else if (edit.type === "REMOVED") {
                blockRemovedLines[blockRemovedLines.length - 1].parts.push({
                  type: "DIFF",
                  content: beforeBreak,
                });
                blockRemovedLines.push({
                  type: "REMOVED",
                  n: newLineN,
                  parts: [],
                });
                oldLineN++;
              } else {
                blockRemovedLines[blockRemovedLines.length - 1].parts.push({
                  type: "DIFF",
                  content: beforeBreak,
                });
                blockRemovedLines.push({
                  type: "REMOVED",
                  n: newLineN,
                  parts: [],
                });
                oldLineN++;
                blockAddedLines[blockAddedLines.length - 1].parts.push({
                  type: "DIFF",
                  content: beforeBreak,
                });
                blockAddedLines.push({
                  type: "ADDED",
                  n: newLineN,
                  parts: [],
                });
                newLineN++;
              }
              editValue = editValue.substring(breakIndex + 1, editValue.length);
            }
          }

          for (let l = 0; l < blockRemovedLines.length; l++) {
            if (blockRemovedLines[l].parts.length > 0) {
              formattedHunk.lines.push(blockRemovedLines[l]);
            }
          }
          for (let l = 0; l < blockAddedLines.length; l++) {
            if (blockAddedLines[l].parts.length > 0) {
              formattedHunk.lines.push(blockAddedLines[l]);
            }
          }
        } else {
          for (let k = 0; k < block.oldLines.length; k++) {
            formattedHunk.lines.push({
              type: "REMOVED",
              n: oldLineN,
              parts: [{ type: "CONTEXT", content: block.oldLines[k].content }],
            });
            oldLineN++;
          }
          for (let k = 0; k < block.newLines.length; k++) {
            formattedHunk.lines.push({
              type: "ADDED",
              n: newLineN,
              parts: [{ type: "CONTEXT", content: block.newLines[k].content }],
            });
            newLineN++;
          }
        }
      }
    }
    formattedHunks.push(formattedHunk);
  }

  return formattedHunks;
}

export function parseFilePatch(patch: string): Hunk[] {
  return computeWordDiffs(groupDiffBlocks(parsePatch(patch)));
}
