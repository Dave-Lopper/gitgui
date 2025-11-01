import {
  ChangedLine,
  ChangedLineStatus,
  ContextLine,
  File,
  FileInfos,
  FileStatus,
  Hunk,
  LinePart,
  StatusEntry,
} from "./entities";

type PartialChangedLine = {
  type?: ChangedLineStatus;
  n?: number;
  parts: LinePart[];
};

type PartialFile = {
  status?: FileStatus;
  displayPaths: string[];
  oldPath?: string | null;
  newPath?: string | null;
  hunks: Hunk[];
};

// function getFileInfos(oldPath: string, newPath: string): FileInfos {
//   let status: FileStatus;
//   let parsedOldPath: string | null = null;
//   let parsedNewPath: string | null = null;

//   if (oldPath === "dev/null") {
//     status = "ADDED";
//   } else if (newPath == "dev/null") {
//     status = "REMOVED";
//   } else if (oldPath === newPath) {
//     status = "MODIFIED";
//     parsedNewPath = newPath;
//     parsedOldPath = oldPath;
//   } else {
//     status = "MOVED";
//     parsedNewPath = newPath;
//     parsedOldPath = oldPath;
//   }

//   let displayPaths: string[] = [];
//   if (status === "ADDED") {
//     if (!newPath) {
//       throw new Error("New path unexpectedly falsish on ADDED file");
//     }
//     displayPaths = [newPath];
//   } else if (status === "REMOVED") {
//     if (!oldPath) {
//       throw new Error("Old path unexpectedly falsish on REMOVED file");
//     }
//     displayPaths = [oldPath];
//   } else if (!oldPath || !newPath) {
//     throw new Error(
//       "Old path or New path unexpectedly falsish on MOVED/MODIFIED file",
//     );
//   } else if (status === "MOVED") {
//     displayPaths = [oldPath, newPath];
//   } else {
//     displayPaths = [newPath];
//   }

//   return {
//     // displayPaths,
//     // oldPath: parsedOldPath,
//     path: parsedNewPath!,
//     status,
//   };
// }

// export function getFileInfosFromDiff(diff: string): FileInfos[] {
//   const splitFilesResult = diff.split(/(^diff --git a\/.+? b\/.+$)/m).slice(1);
//   const fileInfos: FileInfos[] = [];

//   for (let i = 0; i < splitFilesResult.length; i += 2) {
//     const file = splitFilesResult[i];
//     const fileMatch = file.match(/diff --git a\/(.+?) b\/(.+$)/);
//     if (!fileMatch) {
//       throw new Error(`Diff file line unexpectedly formed: ${file}`);
//     }

//     const [, oldPath, newPath] = fileMatch;
//     fileInfos.push(getFileInfos(oldPath, newPath));
//   }

//   return fileInfos;
// }

// export function parseDiff(diff: string, contextLinesCount: number = 3): File[] {
//   const splitFilesResult = diff.split(/(^diff --git a\/.+? b\/.+$)/m).slice(1);
//   const files: File[] = [];

//   for (let i = 0; i < splitFilesResult.length; i += 2) {
//     const file = splitFilesResult[i];
//     const diff = splitFilesResult[i + 1];

//     const fileMatch = file.match(/diff --git a\/(.+?) b\/(.+$)/);
//     if (!fileMatch) {
//       throw new Error(`Diff file line unexpectedly formed: ${file}`);
//     }

//     const [, oldPath, newPath] = fileMatch;
//     const fileInfos = getFileInfos(oldPath, newPath);
//     const currentFile: File = {
//       ...fileInfos,
//       hunks: [],
//       displayPaths: [],
//     };
//     const splitHunksResult = diff
//       .split(/(^@@ -\d+,\d+ \+\d+,\d+ @@)/m)
//       .slice(1);

//     for (let j = 0; j < splitHunksResult.length; j += 2) {
//       const hunk = splitHunksResult[j];
//       const hunkDiff = splitHunksResult[j + 1];
//       let currentAddedLine: PartialChangedLine = { parts: [] };
//       let currentRemovedLine: PartialChangedLine = { parts: [] };

//       const hunkMatch = hunk.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
//       if (!hunkMatch) {
//         throw new Error(`Diff hunk line unexpectedly formed: ${hunk}`);
//       }

//       const [
//         ,
//         rawOldLineStart,
//         rawOldLineCount,
//         rawNewLineStart,
//         rawNewLineCount,
//       ] = hunkMatch;

//       const oldLineStart = parseInt(rawOldLineStart);
//       const oldLineCount = parseInt(rawOldLineCount);
//       const newLineStart = parseInt(rawNewLineStart);
//       const newLineCount = parseInt(rawNewLineCount);

//       const currentHunk: Hunk = {
//         oldLineCount,
//         oldLineStart,
//         newLineCount,
//         newLineStart,
//         lines: [],
//       };

//       const hunkDiffLines = hunkDiff.split("~");
//       for (let k = 0; k < hunkDiffLines.length; k++) {
//         const diffLine = hunkDiffLines[k];
//         // TODO check starting line and substract to contextLinesCount (eg startLine = 2, then can't expect 3 context lines here, same for trailing context (need to find a way to have old len and new len))

//         if (
//           k < contextLinesCount ||
//           k > hunkDiffLines.length - contextLinesCount
//         ) {
//           currentHunk.lines.push({
//             type: "CONTEXT",
//             content: diffLine.slice(1),
//             oldN: oldLineStart + k,
//             newN: newLineStart + k,
//           });
//         } else {
//           const diffLineParts = diffLine.split("\n");
//           let hasRemovedPart = false;
//           let hasAddedPart = false;

//           for (let l = 0; l < diffLineParts.length; l++) {
//             if (diffLineParts[l].startsWith("+")) {
//               hasAddedPart = true;
//             } else if (diffLineParts[l].startsWith("-")) {
//               hasRemovedPart = true;
//             }
//           }

//           for (let l = 0; l < diffLineParts.length; l++) {
//             const linePart = diffLineParts[l];

//             if (linePart.startsWith("+")) {
//               currentAddedLine.parts.push({
//                 type: "DIFF",
//                 content: linePart.slice(1),
//               });
//             } else if (linePart.startsWith("-")) {
//               currentRemovedLine.parts.push({
//                 type: "DIFF",
//                 content: linePart.slice(1),
//               });
//             } else {
//               if (hasAddedPart) {
//                 currentAddedLine.parts.push({
//                   type: "CONTEXT",
//                   content: linePart,
//                 });
//               }
//               if (hasRemovedPart) {
//                 currentRemovedLine.parts.push({
//                   type: "CONTEXT",
//                   content: linePart,
//                 });
//               }
//             }
//           }
//           if (currentRemovedLine.parts.length > 0) {
//             currentHunk.lines.push({
//               type: "REMOVED",
//               n: oldLineStart + k,
//               parts: currentRemovedLine.parts,
//             });
//             currentRemovedLine = { parts: [] };
//           }
//           if (currentAddedLine.parts.length > 0) {
//             currentHunk.lines.push({
//               type: "ADDED",
//               n: newLineStart + k,
//               parts: currentAddedLine.parts,
//             });
//             currentAddedLine = { parts: [] };
//           }
//         }
//       }
//       currentFile.hunks.push(currentHunk);
//     }
//     files.push(currentFile);
//   }

//   return files;
// }

// export function parseNewFileDiff(diffLines: string[]): File {
//   const plusLine = diffLines.find((line) => line.startsWith("+++"));
//   const minusLine = diffLines.find((line) => line.startsWith("---"));

//   if (!plusLine || minusLine) {
//     const partialFile: PartialFile = {
//       status: "ADDED",
//       displayPaths: [],
//       hunks: [],
//     };
//     const diffLine = diffLines.find((line) => line.startsWith("diff --git a/"));
//     if (!diffLine) {
//       throw new Error("Neither +++/--- lines nor diff line in added file diff");
//     }
//     const fileName = diffLine.split("b/").slice(1).join("b/");
//     partialFile.oldPath = null;
//     partialFile.newPath = fileName;
//     partialFile.displayPaths = [fileName];
//     partialFile.hunks = [];
//     const fileInfos = getFileInfos("dev/null", fileName);

//     return {
//       displayPaths: fileInfos.displayPaths,
//       hunks: partialFile.hunks,
//       oldPath: fileInfos.oldPath,
//       newPath: fileInfos.newPath,
//       status: fileInfos.status,
//     };
//   }

//   return parseDiff(diffLines.join("\n"))[0];
// }

type ChangedFileStatus =
  | "REMOVED"
  | "MODIFIED"
  | "UNTRACKED"
  | "MOVED"
  | "ADDED";

export function parseStatus(statusLines: string[]): StatusEntry[] {
  const files: Record<string, StatusEntry> = {};
  for (let i = 0; i < statusLines.length; i++) {
    const line = statusLines[i];
    let staged = false;
    let modType: ChangedFileStatus;
    const indexStatus = line.charAt(0);
    const treeStatus = line.charAt(1);

    if (treeStatus === " ") {
      staged = true;
    }

    if (indexStatus === "A") {
      if (treeStatus !== "D") {
        modType = "ADDED";
      } else {
        // File added in the staging area
        // but removed in the tree, not displaying the diff
        continue;
      }
    } else if (indexStatus === "?" && treeStatus === "?") {
      modType = "UNTRACKED";
    } else if (indexStatus === "D" || treeStatus === "D") {
      modType = "REMOVED";
    } else if (treeStatus === "M" || indexStatus === "M") {
      modType = "MODIFIED";
    } else if (treeStatus === "R" || indexStatus === "R") {
      modType = "MOVED";
    } else if (treeStatus === "C" || indexStatus === "C") {
      modType = "MOVED";
    } else {
      console.warn(`Unexpected staging/tree on status line: ${line}`);
      continue;
    }

    const path = line.slice(3).trim();
    if (path in files) {
      if (modType === "UNTRACKED" && files[path].status === "REMOVED") {
        // Removed in the staging area but re-added in the tree
        files[path].status = "MODIFIED";
      }
    } else {
      files[path] = {
        path,
        status: modType === "UNTRACKED" ? "ADDED" : modType,
        staged,
      };
    }
  }
  return Object.values(files);
}

export function parseFileNumStat(line: string): number[] {
  const matches = line.trimEnd().match(/^([\d-]+)\s+([\d-]+)\s+(.+)$/);
  if (!matches) {
    throw new Error(`Numstat line unexpectedly formed: ${line}`);
  }

  const [, added, removed, _] = matches;
  return [parseInt(added), parseInt(removed)];
}

export function parseFileDiff(
  diff: string,
  file: FileInfos,
  contextLinesCount: number = 3,
): File {
  const fileMatch = diff.match(/diff --git a\/(.+?) b\/(.+$)/m);
  if (!fileMatch) {
    throw new Error(`Diff file line unexpectedly formed: ${diff}`);
  }
  const hunks: Hunk[] = [];
  const [, oldPath, newPath] = fileMatch;
  const rawHunks = diff.split(/(^@@ -\d+,\d+ \+\d+,\d+ @@)/m).slice(1);

  for (let i = 0; i < rawHunks.length; i += 2) {
    const rawHunk = rawHunks[i];
    const rawHunkDiff = rawHunks[i + 1];
    const hunkMatch = rawHunk.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/m);
    if (!hunkMatch) {
      throw new Error(`Diff hunk line unexpectedly formed: ${rawHunk}`);
    }

    const [
      ,
      rawOldLineStart,
      rawOldLineCount,
      rawNewLineStart,
      rawNewLineCount,
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
      lines: [],
    };

    let currentAddedLine: PartialChangedLine = { parts: [] };
    let currentRemovedLine: PartialChangedLine = { parts: [] };

    const flushLine = (type: "ADDED" | "REMOVED", n: number) => {
      currentHunk.lines.push({
        type,
        n,
        parts:
          type === "REMOVED"
            ? currentRemovedLine.parts
            : currentAddedLine.parts,
      });
      if (type === "REMOVED") {
        currentRemovedLine = { parts: [] };
      } else {
        currentAddedLine = { parts: [] };
      }
    };

    const rawLines = rawHunkDiff.split("~").slice(1);
    for (let k = 0; k < rawLines.length; k++) {
      const diffLine = rawLines[k];
      const oldLineEnd = oldLineStart + oldLineCount;
      const newLineEnd = newLineStart + newLineCount;
      const hasLeadingSpaceForContext =
        oldLineStart > contextLinesCount && newLineStart > contextLinesCount;
      const hasTrailingSpaceForContext =
        newLineEnd < file.newLineCount - contextLinesCount &&
        oldLineEnd < file.oldLineCount - contextLinesCount;

      if (
        (k < contextLinesCount && hasLeadingSpaceForContext) ||
        (k > rawLines.length - contextLinesCount && hasTrailingSpaceForContext)
      ) {
        currentHunk.lines.push({
          type: "CONTEXT",
          content: diffLine.slice(1),
          oldN: oldLineStart + k,
          newN: newLineStart + k,
        });
      } else {
        const diffLineParts = diffLine.split("\n").filter((part) => part);
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

          if (linePart.startsWith("+")) {
            currentAddedLine.parts.push({
              type: "DIFF",
              content: linePart.slice(1),
            });
          } else if (linePart.startsWith("-")) {
            currentRemovedLine.parts.push({
              type: "DIFF",
              content: linePart.slice(1),
            });
          } else {
            if (hasAddedPart) {
              currentAddedLine.parts.push({
                type: "CONTEXT",
                content: linePart,
              });
            }
            if (hasRemovedPart) {
              currentRemovedLine.parts.push({
                type: "CONTEXT",
                content: linePart,
              });
            }
          }
        }

        const prevLineParts = rawLines[k - 1]
          ?.split("\n")
          .filter((part) => part.length > 0);

        if (currentRemovedLine.parts.length > 0 && hasRemovedPart) {
          flushLine("REMOVED", oldLineStart + k);
        }
        if (currentAddedLine.parts.length > 0 && hasAddedPart) {
          flushLine("ADDED", newLineStart + k);
        }
      }
    }
    hunks.push(currentHunk);
  }

  let displayPaths: string[];
  if (file.status === "ADDED") {
    displayPaths = [newPath];
  } else if (file.status === "REMOVED") {
    displayPaths = [oldPath];
  } else if (file.status === "MOVED") {
    displayPaths = [oldPath, newPath];
  } else {
    displayPaths = [newPath];
  }
  return { ...file, hunks, displayPaths };
}

type HunkPart = {
  addedLines: ChangedLine[];
  removedLines: ChangedLine[];
  trailingContext: ContextLine[];
};

export function parseFileDiff2(
  diff: string,
  file: FileInfos,
  contextLinesCount: number = 3,
): File {
  const fileMatch = diff.match(/diff --git a\/(.+?) b\/(.+$)/m);
  if (!fileMatch) {
    throw new Error(`Diff file line unexpectedly formed: ${diff}`);
  }
  const hunks: Hunk[] = [];
  const [, oldPath, newPath] = fileMatch;
  const rawHunks = diff.split(/(^@@ -\d+,\d+ \+\d+,\d+ @@)/m).slice(1);

  for (let i = 0; i < rawHunks.length; i += 2) {
    const rawHunk = rawHunks[i];
    const rawHunkDiff = rawHunks[i + 1];
    const hunkMatch = rawHunk.match(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/m);
    if (!hunkMatch) {
      throw new Error(`Diff hunk line unexpectedly formed: ${rawHunk}`);
    }

    const [
      ,
      rawOldLineStart,
      rawOldLineCount,
      rawNewLineStart,
      rawNewLineCount,
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
      lines: [],
    };
    let currentHunkPart: HunkPart = {
      addedLines: [],
      removedLines: [],
      trailingContext: [],
    };

    const flushHunkPart = () => {
      // console.log(
      //   "FLUSHING HUNK PART",
      //   "ADDED",
      //   currentHunkPart.addedLines,
      //   "REMOVED",
      //   currentHunkPart.removedLines,
      //   "CONTEXT",
      //   currentHunkPart.trailingContext,
      // );
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

    const rawLines = rawHunkDiff.split("~").slice(1);
    for (let k = 0; k < rawLines.length; k++) {
      const diffLine = rawLines[k];
      const oldLineEnd = oldLineStart + oldLineCount;
      const newLineEnd = newLineStart + newLineCount;
      const hasLeadingSpaceForContext =
        oldLineStart > contextLinesCount && newLineStart > contextLinesCount;
      const hasTrailingSpaceForContext =
        newLineEnd < file.newLineCount - contextLinesCount &&
        oldLineEnd < file.oldLineCount - contextLinesCount;

      if (
        (k < contextLinesCount && hasLeadingSpaceForContext) ||
        (k > rawLines.length - contextLinesCount && hasTrailingSpaceForContext)
      ) {
        currentHunk.lines.push({
          type: "CONTEXT",
          content: diffLine.slice(1),
          oldN: oldLineStart + k,
          newN: newLineStart + k,
        });
      } else {
        const diffLineParts = diffLine.split("\n").filter((part) => part);
        const nextRawLine = rawLines[k + 1];
        const nextRawLineParts = nextRawLine
          ?.split("\n")
          .filter((part) => part);

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
              addLinePart(
                "REMOVED",
                "DIFF",
                oldLineStart + k,
                linePart.slice(1),
              );
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

        const lastLinePartIndex =
          diffLineParts.length > 0 ? diffLineParts.length - 1 : 0;
        if (diffLineParts[lastLinePartIndex]?.startsWith("+")) {
          currentHunkPart.addedLines.push({
            type: "ADDED",
            parts: [],
            n: newLineStart + k + 1,
          });
        }
        if (diffLineParts[lastLinePartIndex]?.startsWith("-")) {
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
    }
    hunks.push(currentHunk);
  }

  let displayPaths: string[];
  if (file.status === "ADDED") {
    displayPaths = [newPath];
  } else if (file.status === "REMOVED") {
    displayPaths = [oldPath];
  } else if (file.status === "MOVED") {
    displayPaths = [oldPath, newPath];
  } else {
    displayPaths = [newPath];
  }
  return { ...file, hunks, displayPaths };
}

export function getOneSidedDiff(
  fileContents: string,
  file: FileInfos,
  status: "ADDED" | "REMOVED",
): File {
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

  return { ...file, displayPaths: [file.path], hunks: [hunk] };
}
