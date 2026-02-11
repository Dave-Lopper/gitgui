import { LineTokenizer, Token } from "..";

export type ProgrammingLangLexerState = {
  inBlockComment: boolean;
  inString: string | null;
  inStringTemplateExpr: number;
};

export type ProgrammingLangTokenType =
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

export interface LanguageSpecificLexer {
  functionDeclarators: string[];
  keywords: string[];
  nativeTypes: string[];
  numericTypes: string[];
  operators: string[];
  punctuation: string[];
  stringClosersMapping: Record<string, string>;
  varDeclarators: string[];
  getStringTemplateClosingIndex: (value: string) => number;
  isBlockCommentOpening: (value: string) => number;
  isBlockCommentClosing: (value: string) => number;
  isLineComment: (value: string) => boolean;
  isStringMarker: (value: string) => number;
  isStringTemplateClosing: (
    value: string,
    state: ProgrammingLangLexerState,
  ) => number;
  isStringTemplateOpening: (
    value: string,
    state: ProgrammingLangLexerState,
  ) => number;
  lineHasBlockCommentClosing: (value: string) => number;
}

export class ProgrammingLangLineTokenizer
  implements LineTokenizer<ProgrammingLangTokenType, ProgrammingLangLexerState>
{
  public readonly initialState: ProgrammingLangLexerState = {
    inBlockComment: false,
    inString: null,
    inStringTemplateExpr: 0,
  } as const;
  constructor(private readonly langLexer: LanguageSpecificLexer) {}

  public tokenizeLine(
    line: string,
    state: ProgrammingLangLexerState,
  ): {
    tokens: Token<ProgrammingLangTokenType>[];
    state: ProgrammingLangLexerState;
  } {
    const tokens: Token<ProgrammingLangTokenType>[] = [];
    const sepChars = [
      ...this.langLexer.punctuation,
      "\t",
      "\n",
      " ",
      undefined,
      "",
    ];
    let toProcess = line;
    let i = 0;

    while (toProcess.length > 0) {
      toProcess = line.substring(i, line.length);
      const char = line.charAt(i);
      const prevChar = line.charAt(i - 1);

      const stringMarkerLength = this.langLexer.isStringMarker(toProcess);

      if (stringMarkerLength > 0) {
        if (
          state.inString !== null &&
          toProcess.startsWith(
            this.langLexer.stringClosersMapping[state.inString],
          )
        ) {
          tokens.push({
            type: "punctuation",
            value: this.langLexer.stringClosersMapping[state.inString],
          });
          i += this.langLexer.stringClosersMapping[state.inString].length;
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
        const stringTplOpeningLength = this.langLexer.isStringTemplateOpening(
          toProcess,
          state,
        );
        if (stringTplOpeningLength > 0) {
          tokens.push({
            type: "punctuation",
            value: toProcess.substring(0, stringTplOpeningLength),
          });
          state.inStringTemplateExpr++;
          i += stringTplOpeningLength;
          continue;
        }

        const stringTplClosingLength = this.langLexer.isStringTemplateClosing(
          toProcess,
          state,
        );
        if (stringTplClosingLength > 0) {
          tokens.push({ type: "punctuation", value: char });
          state.inStringTemplateExpr--;
          i += stringTplClosingLength;
          continue;
        }

        if (state.inStringTemplateExpr > 0) {
          const closingIndex =
            this.langLexer.getStringTemplateClosingIndex(toProcess);

          let langSubstring;
          if (closingIndex > -1) {
            langSubstring = toProcess.substring(0, closingIndex);
          } else {
            langSubstring = toProcess;
          }
          const tokenizerRv = this.tokenizeLine(langSubstring, {
            inString: null,
            inStringTemplateExpr: 0,
            inBlockComment: false,
          });

          tokens.push(...tokenizerRv.tokens);
          i += langSubstring.length;
          continue;
        }

        if (tokens.length > 0 && tokens[tokens.length - 1].type === "string") {
          tokens[tokens.length - 1].value += char;
        } else {
          tokens.push({ type: "string", value: char });
        }
        i++;
        continue;
      }

      if (state.inBlockComment) {
        const closingIndex =
          this.langLexer.lineHasBlockCommentClosing(toProcess);
        if (closingIndex === -1) {
          tokens.push({ type: "comment", value: toProcess });
          return { tokens, state };
        }

        tokens.push({
          type: "comment",
          value: toProcess.substring(0, closingIndex),
        });
        i += closingIndex; // Skip next chars as we just added them
        state.inBlockComment = false;
        continue;
      }

      if (this.langLexer.isLineComment(toProcess)) {
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
        this.langLexer.isBlockCommentOpening(toProcess)
      ) {
        state.inBlockComment = true;
        const closingIndex =
          this.langLexer.lineHasBlockCommentClosing(toProcess);

        if (closingIndex === -1) {
          tokens.push({ type: "comment", value: toProcess });
          return { tokens, state };
        }

        tokens.push({
          type: "comment",
          value: toProcess.substring(0, closingIndex),
        });
        i += closingIndex; // Skip next chars as we just added them
        state.inBlockComment = false;
        continue;
      }

      let shouldContinue = false;
      for (let j = 0; j < this.langLexer.keywords.length; j++) {
        const keyword = this.langLexer.keywords[j];
        const nextChar = toProcess.charAt(keyword.length);
        if (
          toProcess.startsWith(keyword) &&
          sepChars.includes(prevChar) &&
          sepChars.includes(nextChar)
        ) {
          tokens.push({ type: "keyword", value: `${keyword} ` });
          i += keyword.length + 1;
          shouldContinue = true;
          break;
        }
      }

      for (let j = 0; j < this.langLexer.operators.length; j++) {
        const operator = this.langLexer.operators[j];

        if (toProcess.startsWith(operator)) {
          tokens.push({ type: "operator", value: operator });
          i += operator.length;
          shouldContinue = true;
          break;
        }
      }

      for (let j = 0; j < this.langLexer.varDeclarators.length; j++) {
        const varDeclarator = this.langLexer.varDeclarators[j];
        const nextChar = toProcess.charAt(varDeclarator.length);

        if (
          toProcess.startsWith(varDeclarator) &&
          sepChars.includes(nextChar) &&
          sepChars.includes(prevChar)
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

      for (let j = 0; j < this.langLexer.nativeTypes.length; j++) {
        const nativeType = this.langLexer.nativeTypes[j];
        const nextChar = toProcess.charAt(nativeType.length);
        if (
          toProcess.startsWith(nativeType) &&
          sepChars.includes(prevChar) &&
          sepChars.includes(nextChar)
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

      for (let j = 0; j < this.langLexer.functionDeclarators.length; j++) {
        const funcDeclarator = this.langLexer.functionDeclarators[j];
        const nextChar = toProcess.charAt(funcDeclarator.length);

        if (
          toProcess.startsWith(`${funcDeclarator} `) &&
          sepChars.includes(prevChar) &&
          sepChars.includes(nextChar)
        ) {
          tokens.push({
            type: "functionDeclaration",
            value: `${funcDeclarator} `,
          });
          i += funcDeclarator.length + 1;
          shouldContinue = true;
        }
      }

      for (let j = 0; j < this.langLexer.numericTypes.length; j++) {
        const numericType = this.langLexer.numericTypes[j];
        const nextChar = toProcess.charAt(numericType.length);

        if (
          toProcess.startsWith(numericType) &&
          sepChars.includes(prevChar) &&
          sepChars.includes(nextChar)
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

      if (this.langLexer.punctuation.includes(char)) {
        tokens.push({ type: "punctuation", value: char });
        i++;
        continue;
      }

      const digitMatch = toProcess.match(/^([0-9.]+)[\s\)\];\}\+\-*%><=,]?/);
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
