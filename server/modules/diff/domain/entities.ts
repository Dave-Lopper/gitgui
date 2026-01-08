import { Token } from "./services/tokenizer";

export type DiffRepresentation = "PLAINTEXT" | "TOKENIZED";
type ContentByRep = {
  PLAINTEXT: string;
  TOKENIZED: Token[];
};

export type LinePart<R extends DiffRepresentation> = {
  type: "DIFF" | "CONTEXT";
  content: ContentByRep[R];
};

export type ContextLine<R extends DiffRepresentation> = {
  oldN: number;
  newN: number;
  content: ContentByRep[R];
  type: "CONTEXT";
};

const lineStatuses = ["ADDED", "REMOVED"] as const;
export type ChangedLineStatus = (typeof lineStatuses)[number];

export type ChangedLine<R extends DiffRepresentation> = {
  type: ChangedLineStatus;
  n: number;
  parts: LinePart<R>[];
};

export type Hunk<R extends DiffRepresentation> = {
  enclosingBlock?: string;
  oldLineCount: number;
  oldLineStart: number;
  newLineCount: number;
  newLineStart: number;
  lines: (ChangedLine<R> | ContextLine<R>)[];
};

export type DiffEntry<R extends DiffRepresentation> = {
  representation: R;
  addedLines: number;
  removedLines: number;
  hunks: Hunk<R>[];
};
