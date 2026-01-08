import { JavascriptTokenizer } from "./javascript.js";

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

export type LexerState = {
  inBlockComment: boolean;
  inString: null | string;
  inStringTemplateExpr: number;
};

export interface LanguageSpecificTokenizer {
  functionDeclarators: string[];
  keywords: string[];
  nativeTypes: string[];
  numericTypes: string[];
  operators: string[];
  punctuation: string[];
  stringClosersMapping: Record<string, string>;
  varDeclarators: string[];
  isBlockCommentOpening: (value: string) => number;
  isBlockCommentClosing: (value: string) => number;
  isLineComment: (value: string) => boolean;
  isStringMarker: (value: string) => number;
  isStringTemplateClosing: (value: string, state: LexerState) => number;
  isStringTemplateOpening: (value: string, state: LexerState) => number;
  lineHasBlockCommentClosing: (value: string) => number;
}

export class LineTokenizer {
  constructor(
    private readonly langSpecificTokenizer: LanguageSpecificTokenizer,
  ) {}

  public tokenizeLine(
    line: string,
    state: LexerState,
  ): { tokens: Token[]; state: LexerState } {
    const tokens: Token[] = [];
    let toProcess = line;
    let i = 0;

    while (toProcess.length > 0) {
      const char = line.charAt(i);
      const nextChar = line.charAt(i + 1);
      const prevChar = line.charAt(i - 1);

      const stringMarkerLength =
        this.langSpecificTokenizer.isStringMarker(toProcess);

      if (stringMarkerLength > 0) {
        if (
          state.inString !== null &&
          toProcess.startsWith(
            this.langSpecificTokenizer.stringClosersMapping[state.inString],
          )
        ) {
          tokens.push({
            type: "punctuation",
            value:
              this.langSpecificTokenizer.stringClosersMapping[state.inString],
          });
          i +=
            this.langSpecificTokenizer.stringClosersMapping[state.inString]
              .length;
          state.inString = null;
          continue;
        } else if (state.inString === null) {
          state.inString = toProcess.substring(0, stringMarkerLength);
          tokens.push(
            { type: "punctuation", value: state.inString },
            { type: "string", value: "" },
          );
          i += stringMarkerLength;
          continue;
        } else {
          if (tokens.length > 0) {
            tokens[tokens.length - 1].value += toProcess.substring(
              0,
              stringMarkerLength,
            );
          } else {
            tokens.push({
              type: "string",
              value: toProcess.substring(0, stringMarkerLength),
            });
          }
          i += stringMarkerLength;
        }

        continue;
      }

      if (state.inString !== null) {
        const stringTplOpeningLength =
          this.langSpecificTokenizer.isStringTemplateOpening(toProcess, state);
        if (stringTplOpeningLength > 0) {
          tokens.push({
            type: "punctuation",
            value: toProcess.substring(0, stringTplOpeningLength),
          });
          state.inStringTemplateExpr++;
          i += stringTplOpeningLength;
          continue;
        }

        const stringTplClosingLength =
          this.langSpecificTokenizer.isStringTemplateClosing(toProcess, state);
        if (stringTplClosingLength > 0) {
          tokens.push({ type: "punctuation", value: char });
          state.inStringTemplateExpr--;
          i += stringTplClosingLength;
          continue;
        }

        if (tokens.length > 0) {
          tokens[tokens.length - 1].value += char;
        } else {
          tokens.push({ type: "string", value: char });
        }
        i++;
        continue;
      }

      if (this.langSpecificTokenizer.isLineComment(toProcess)) {
        tokens.push({ type: "comment", value: toProcess });
        return { tokens, state };
      }

      if (char === " " || char === "\t") {
        tokens.push({ type: "whitespace", value: char });
        i++;
        continue;
      }

      if (
        state.inBlockComment === false &&
        state.inString === null &&
        this.langSpecificTokenizer.isBlockCommentOpening(toProcess)
      ) {
        state.inBlockComment = true;
        const closingIndex =
          this.langSpecificTokenizer.lineHasBlockCommentClosing(toProcess);

        if (closingIndex === -1) {
          tokens.push({ type: "comment", value: toProcess });
          return { tokens, state };
        }

        tokens.push({
          type: "comment",
          value: toProcess.substring(0, closingIndex),
        });
        i += closingIndex; // Skip next chars as we just added them
        continue;
      }

      let shouldContinue = false;
      for (let j = 0; j < this.langSpecificTokenizer.keywords.length; j++) {
        const keyword = this.langSpecificTokenizer.keywords[j];
        if (
          toProcess.startsWith(`${keyword} `) &&
          (prevChar === " " || prevChar === "\t" || this,
          this.langSpecificTokenizer.punctuation.includes(prevChar) ||
            prevChar.length === 0)
        ) {
          tokens.push({ type: "keyword", value: `${keyword} ` });
          i += keyword.length + 1;
          shouldContinue = true;
          break;
        }
      }

      for (let j = 0; j < this.langSpecificTokenizer.operators.length; j++) {
        const operator = this.langSpecificTokenizer.operators[j];
        if (toProcess.startsWith(operator)) {
          tokens.push({ type: "operator", value: operator });
          i += operator.length;
          shouldContinue = true;
          break;
        }
      }

      for (
        let j = 0;
        j < this.langSpecificTokenizer.varDeclarators.length;
        j++
      ) {
        const varDeclarator = this.langSpecificTokenizer.varDeclarators[j];
        if (
          toProcess.startsWith(`${varDeclarator} `) &&
          (prevChar === " " || prevChar === "\t" || prevChar.length === 0)
        ) {
          tokens.push({
            type: "variableDeclaration",
            value: `${varDeclarator} `,
          });
          i += varDeclarator.length + 1;
          shouldContinue = true;
          break;
        }
      }

      for (let j = 0; j < this.langSpecificTokenizer.nativeTypes.length; j++) {
        const nativeType = this.langSpecificTokenizer.nativeTypes[j];
        if (
          toProcess.startsWith(nativeType) &&
          (!toProcess.charAt(nativeType.length) ||
            this.langSpecificTokenizer.punctuation.includes(
              toProcess.charAt(nativeType.length),
            ) ||
            toProcess.charAt(nativeType.length) === " ") &&
          (prevChar.length === 0 ||
            this.langSpecificTokenizer.punctuation.includes(prevChar) ||
            prevChar === " ")
        ) {
          tokens.push({
            type: "typeHint",
            value: nativeType,
          });
          i += nativeType.length;
          shouldContinue = true;
          break;
        }
      }

      for (
        let j = 0;
        j < this.langSpecificTokenizer.functionDeclarators.length;
        j++
      ) {
        const funcDeclarator =
          this.langSpecificTokenizer.functionDeclarators[j];

        if (
          toProcess.startsWith(`${funcDeclarator} `) &&
          (prevChar === " " || prevChar === "\t" || prevChar.length === 0)
        ) {
          tokens.push({
            type: "functionDeclaration",
            value: `${funcDeclarator} `,
          });
          i += funcDeclarator.length + 1;
          shouldContinue = true;
        }
      }

      for (let j = 0; j < this.langSpecificTokenizer.numericTypes.length; j++) {
        const numericType = this.langSpecificTokenizer.numericTypes[j];

        if (
          toProcess.startsWith(numericType) &&
          (prevChar === " " || prevChar === "\t" || prevChar.length === 0) &&
          (toProcess.charAt(numericType.length) === " " ||
            toProcess.charAt(numericType.length) === "\t" ||
            this.langSpecificTokenizer.punctuation.includes(
              toProcess.charAt(numericType.length),
            ))
        ) {
          tokens.push({
            type: "number",
            value: numericType,
          });
          i += numericType.length;
          shouldContinue = true;
        }
      }

      if (shouldContinue) {
        continue;
      }

      if (this.langSpecificTokenizer.punctuation.includes(char)) {
        tokens.push({ type: "punctuation", value: char });
        i++;
        continue;
      }

      const digitMatch = toProcess.match(/^([0-9]+)[\s\)\];\}]/);
      if (digitMatch && digitMatch[1] && digitMatch[1].length > 0) {
        tokens.push({ type: "number", value: digitMatch[1] });
        i += digitMatch[1].length;
        continue;
      }

      if (
        tokens[tokens.length - 1] &&
        tokens[tokens.length - 1].type === "unknown"
      ) {
        tokens[tokens.length - 1].value += char;
        i++;
      } else {
        tokens.push({ type: "unknown", value: char });
        i++;
      }
    }

    return { state, tokens };
  }
}

export const highlightSupportedFileTypes = new Map<string, LineTokenizer>();
highlightSupportedFileTypes.set(
  "js",
  new LineTokenizer(new JavascriptTokenizer()),
);
highlightSupportedFileTypes.set(
  "ts",
  new LineTokenizer(new JavascriptTokenizer()),
);
highlightSupportedFileTypes.set(
  "cjs",
  new LineTokenizer(new JavascriptTokenizer()),
);
highlightSupportedFileTypes.set(
  "mjs",
  new LineTokenizer(new JavascriptTokenizer()),
);
