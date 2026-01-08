export type DiffRepresentation = "PLAINTEXT" | "TOKENIZED";

export type TokenType =
  | "keyword"
  | "number"
  | "string"
  | "comment"
  | "operator"
  | "punctuation"
  | "whitespace"
  | "unknown"
  | "functionDeclaration"
  | "identifier"
  | "variableDeclaration"
  | "typeHint";

export type Token = {
  type: TokenType;
  value: string;
};

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

const fileStatuses = ["ADDED", "REMOVED", "MODIFIED", "MOVED"] as const;
export type FileStatus = (typeof fileStatuses)[number];

export type DiffEntry<R extends DiffRepresentation> = {
  representation: R;
  addedLines: number;
  removedLines: number;
  hunks: Hunk<R>[];
};
