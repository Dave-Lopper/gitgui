import { ChangedLine, DiffRepresentation, Hunk } from "../../entities.js";
import { TOKENIZERS } from "../tokenizer/bootstrap.js";
import { LineTokenizer, Token } from "../tokenizer/index.js";
import { myersDiff } from "./myers.js";

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

type DiffBlock = {
  type: "UNCHANGED" | "ADDED" | "REMOVED" | "MODIFIED";
  oldLines: RawLine[];
  newLines: RawLine[];
};

type BlockedHunk = Omit<RawHunk, "lines"> & { blocks: DiffBlock[] };

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

function computeWordDiffs(
  rawHunks: BlockedHunk[],
  tokenizer: undefined | LineTokenizer<unknown, unknown>,
): Hunk<DiffRepresentation>[] {
  // console.log({ rawHunks });
  const formattedHunks: Hunk<DiffRepresentation>[] = [];

  for (let i = 0; i < rawHunks.length; i++) {
    const rawHunk = rawHunks[i];
    const formattedHunk: Hunk<DiffRepresentation> = {
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
      let lexerState = tokenizer?.initialState;

      const block = rawHunk.blocks[j];

      if (block.type === "UNCHANGED") {
        for (let k = 0; k < block.oldLines.length; k++) {
          let content: Token<unknown>[] | string;
          if (tokenizer) {
            const tokenizerRv = tokenizer.tokenizeLine(
              block.oldLines[k].content,
              lexerState,
            );
            lexerState = tokenizerRv.state;
            content = tokenizerRv.tokens;
          } else {
            content = block.oldLines[k].content;
          }

          formattedHunk.lines.push({
            type: "CONTEXT",
            oldN: oldLineN,
            newN: newLineN,
            content,
          });
          oldLineN++;
          newLineN++;
        }
        continue;
      }

      if (block.type === "REMOVED") {
        for (let k = 0; k < block.oldLines.length; k++) {
          let content: Token<unknown>[] | string;
          if (tokenizer) {
            const tokenizerRv = tokenizer.tokenizeLine(
              block.oldLines[k].content,
              lexerState,
            );
            lexerState = tokenizerRv.state;
            content = tokenizerRv.tokens;
          } else {
            content = block.oldLines[k].content;
          }

          formattedHunk.lines.push({
            type: "REMOVED",
            n: newLineN,
            parts: [{ type: "CONTEXT", content }],
          });
          oldLineN++;
        }
        continue;
      }

      if (block.type === "ADDED") {
        for (let k = 0; k < block.newLines.length; k++) {
          let content: Token<unknown>[] | string;
          if (tokenizer) {
            const tokenizerRv = tokenizer.tokenizeLine(
              block.newLines[k].content,
              lexerState,
            );
            lexerState = tokenizerRv.state;
            content = tokenizerRv.tokens;
          } else {
            content = block.newLines[k].content;
          }

          formattedHunk.lines.push({
            type: "ADDED",
            n: newLineN,
            parts: [{ type: "CONTEXT", content }],
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

            const removedLine: ChangedLine<DiffRepresentation> = {
              type: "REMOVED",
              n: oldLineN,
              parts: [],
            };
            const addedLine: ChangedLine<DiffRepresentation> = {
              type: "ADDED",
              n: newLineN,
              parts: [],
            };

            for (let l = 0; l < edits.length; l++) {
              const edit = edits[l];
              let content: Token<unknown>[] | string;
              if (tokenizer) {
                const tokenizerRv = tokenizer.tokenizeLine(
                  edit.value,
                  lexerState,
                );
                lexerState = tokenizerRv.state;
                content = tokenizerRv.tokens;
              } else {
                content = edit.value;
              }

              if (edit.type === "UNCHANGED") {
                removedLine.parts.push({
                  type: "CONTEXT",
                  content,
                });
                addedLine.parts.push({
                  type: "CONTEXT",
                  content,
                });
              } else if (edit.type === "ADDED") {
                addedLine.parts.push({
                  type: "DIFF",
                  content,
                });
              } else {
                removedLine.parts.push({
                  type: "DIFF",
                  content,
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
          const blockAddedLines: ChangedLine<DiffRepresentation>[] = [
            {
              type: "ADDED",
              n: oldLineN,
              parts: [],
            },
          ];
          const blockRemovedLines: ChangedLine<DiffRepresentation>[] = [
            {
              type: "REMOVED",
              n: oldLineN,
              parts: [],
            },
          ];

          for (let k = 0; k < edits.length; k++) {
            const edit = edits[k];
            let editValue = edit.value;

            let content: Token<unknown>[] | string;
            if (tokenizer) {
              const tokenizerRv = tokenizer.tokenizeLine(
                edit.value,
                lexerState,
              );
              lexerState = tokenizerRv.state;
              content = tokenizerRv.tokens;
            } else {
              content = edit.value;
            }

            while (editValue.length > 0) {
              const newLineIndex = editValue.indexOf("\n");
              if (newLineIndex === -1) {
                if (edit.type === "ADDED") {
                  blockAddedLines[blockAddedLines.length - 1].parts.push({
                    type: "DIFF",
                    content,
                  });
                } else if (edit.type === "REMOVED") {
                  blockRemovedLines[blockRemovedLines.length - 1].parts.push({
                    type: "DIFF",
                    content,
                  });
                } else {
                  blockRemovedLines[blockRemovedLines.length - 1].parts.push({
                    type: "DIFF",
                    content,
                  });
                  blockAddedLines[blockAddedLines.length - 1].parts.push({
                    type: "DIFF",
                    content,
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
            let content: Token<unknown>[] | string;
            if (tokenizer) {
              const tokenizerRv = tokenizer.tokenizeLine(
                block.oldLines[k].content,
                lexerState,
              );
              lexerState = tokenizerRv.state;
              content = tokenizerRv.tokens;
            } else {
              content = block.oldLines[k].content;
            }

            formattedHunk.lines.push({
              type: "REMOVED",
              n: oldLineN,
              parts: [{ type: "CONTEXT", content }],
            });
            oldLineN++;
          }
          for (let k = 0; k < block.newLines.length; k++) {
            lexerState = tokenizer?.initialState;
            let content: Token<unknown>[] | string;
            if (tokenizer) {
              const tokenizerRv = tokenizer.tokenizeLine(
                block.oldLines[k].content,
                lexerState,
              );
              lexerState = tokenizerRv.state;
              content = tokenizerRv.tokens;
            } else {
              content = block.oldLines[k].content;
            }
            formattedHunk.lines.push({
              type: "ADDED",
              n: newLineN,
              parts: [{ type: "CONTEXT", content }],
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

export function parseFilePatch(
  filePath: string,
  patch: string,
): {
  diffRepresentation: DiffRepresentation;
  hunks: Hunk<DiffRepresentation>[];
} {
  let tokenizer: LineTokenizer<unknown, unknown> | undefined = undefined;
  const lastDotIndex = filePath.lastIndexOf(".");

  if (lastDotIndex > -1) {
    const extension = filePath.substring(lastDotIndex + 1, filePath.length);
    tokenizer = TOKENIZERS.get(extension);
  }

  return {
    hunks: computeWordDiffs(groupDiffBlocks(parsePatch(patch)), tokenizer),
    diffRepresentation: tokenizer === undefined ? "PLAINTEXT" : "TOKENIZED",
  };
}
