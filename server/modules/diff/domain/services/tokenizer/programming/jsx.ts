import { LineTokenizer, Token } from "..";
import { JavascriptTokenizer } from "./languages/javascript.js";

export type JsxLexerState = {
  inBlockComment: boolean;
  inString: string | null;
  inStringTemplateExpr: number;
  inJsxTag: boolean;
  lexerMode: "js" | "jsx" | "jsxExpression";
  braceDepth: number;
};

export type JsxTokenType =
  | "attribute"
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

const EXPR_ALLOWED_AFTER = new Set<JsxTokenType>([
  "operator",
  "punctuation",
  "keyword",
  "whitespace",
]);

const EXPR_DISALLOWED_AFTER = new Set<JsxTokenType>([
  "identifier",
  "number",
  "string",
  "unknown",
]);

export class JsxLineTokenizer
  implements LineTokenizer<JsxTokenType, JsxLexerState>
{
  public readonly initialState: JsxLexerState = {
    inBlockComment: false,
    inString: null,
    inStringTemplateExpr: 0,
    lexerMode: "js",
    braceDepth: 0,
    inJsxTag: false,
  } as const;
  private jsTokenizer = new JavascriptTokenizer();
  private jsSepChars = [
    ...this.jsTokenizer.punctuation.filter((p) => p !== "."),
    "\t",
    "\n",
    " ",
    undefined,
    "",
  ];
  private sepChars = [
    ...this.jsTokenizer.punctuation.filter((p) => p !== "."),
    "\t",
    "\n",
    " ",
    undefined,
    "",
  ];

  private looksLikeJsx(toProcess: string): boolean {
    return (
      (toProcess.startsWith("</") && /<\/[A-Za-z]/.test(toProcess)) ||
      (toProcess.startsWith("<") && /<[A-Za-z]/.test(toProcess))
    );
  }

  private isValidJsxTagStart(
    toProcess: string,
    prevToken: Token<JsxTokenType> | undefined,
    state: JsxLexerState,
  ): boolean {
    // Never inside strings or comments
    if (state.inString !== null || state.inBlockComment) {
      return false;
    }

    if (!this.looksLikeJsx(toProcess)) {
      return false;
    }

    // Start of line → JSX allowed
    if (!prevToken) {
      return true;
    }

    // Disallowed contexts
    if (EXPR_DISALLOWED_AFTER.has(prevToken.type)) {
      return false;
    }

    if (
      prevToken.type === "punctuation" &&
      [")", "]", "}", ":"].includes(prevToken.value)
    ) {
      return false;
    }

    return true;
  }

  public tokenizeJsx(
    tokens: Token<JsxTokenType>[],
    line: string,
    state: JsxLexerState,
  ): {
    tokens: Token<JsxTokenType>[];
    state: JsxLexerState;
    remainder: string;
  } {
    let remainder = line;
    let i = 0;
    const whiteSpaceRegexp = /^(\s+)/g;

    while (remainder.length > 0) {
      remainder = line.substring(i, line.length);
      const char = remainder.charAt(0);

      const whiteSpaceMatch = whiteSpaceRegexp.exec(remainder);
      if (whiteSpaceMatch !== null) {
        const space = whiteSpaceMatch[1];
        tokens.push({ type: "whitespace", value: space });
        i += space.length;
        continue;
      }

      if (state.inJsxTag && char === "=") {
        tokens.push({ type: "operator", value: "=" });
        i++;
        continue;
      }

      if (state.inString === null && state.inJsxTag && char === '"') {
        const closingIndex = remainder.substring(1).indexOf('"');
        let tokenValue = '"';
        if (closingIndex > -1) {
          tokenValue += remainder.substring(1, closingIndex + 2);
        } else {
          tokenValue += remainder;
          state.inString = '"';
        }
        tokens.push({ type: "string", value: tokenValue });
        i += tokenValue.length + 1;
        continue;
      }

      if (char === "{") {
        state.lexerMode = "js";
        state.braceDepth += 1;
        tokens.push({ type: "punctuation", value: "{" });
        i++;
        return { tokens, state, remainder: line.substring(i, line.length) };
      }

      if (remainder.startsWith("<>")) {
        tokens.push({ type: "punctuation", value: "<>" });
        i += 2;
        state.inJsxTag = false;
        continue;
      }
      if (remainder.startsWith("</>")) {
        tokens.push({ type: "punctuation", value: "</>" });
        i += 3;
        state.inJsxTag = false;
        continue;
      }

      if (remainder.startsWith("<")) {
        tokens.push({ type: "punctuation", value: "<" });
        i++;
        const tagNmame = remainder.substring(1).split(" ")[0];
        tokens.push({ type: "keyword", value: tagNmame });
        i += tagNmame.length;
        state.inJsxTag = true;
        continue;
      }

      if (remainder.startsWith("/>")) {
        tokens.push({ type: "punctuation", value: "/>" });
        i += 2;
        state.inJsxTag = false;
        continue;
      }

      if (state.inJsxTag) {
        if (
          tokens.length > 0 &&
          tokens[tokens.length - 1].type === "attribute"
        ) {
          tokens[tokens.length - 1].value += char;
        } else {
          tokens.push({ type: "attribute", value: char });
        }
        i++;
        continue;
      }

      if (tokens.length > 0 && tokens[tokens.length - 1].type === "unknown") {
        tokens[tokens.length - 1].value += char;
      } else {
        tokens.push({ type: "unknown", value: char });
      }
    }

    return { tokens, state, remainder };
  }

  public tokenizeJs(
    tokens: Token<JsxTokenType>[],
    line: string,
    state: JsxLexerState,
  ): {
    state: JsxLexerState;
    tokens: Token<JsxTokenType>[];
    remainder: string;
  } {
    let remainder = line;
    let i = 0;
    const jsStringsClosersMapping = this.jsTokenizer
      .stringClosersMapping as Record<string, string>;

    while (remainder.length > 0) {
      remainder = line.substring(i, line.length);
      const char = line.charAt(i);
      const prevChar = line.charAt(i - 1);

      const stringMarkerLength = this.jsTokenizer.isStringMarker(remainder);
      if (stringMarkerLength > 0) {
        if (
          state.inString !== null &&
          remainder.startsWith(
            (this.jsTokenizer.stringClosersMapping as Record<string, string>)[
              state.inString
            ],
          )
        ) {
          tokens.push({
            type: "punctuation",
            value: jsStringsClosersMapping[state.inString],
          });
          i += jsStringsClosersMapping[state.inString].length;
          state.inString = null;
          continue;
        } else if (state.inString === null) {
          state.inString = remainder.substring(0, stringMarkerLength);
          tokens.push(
            { type: "punctuation", value: state.inString },
            { type: "string", value: "" },
          );
          i += stringMarkerLength;
          continue;
        } else {
          if (tokens.length > 0) {
            tokens[tokens.length - 1].value += remainder.substring(
              0,
              stringMarkerLength,
            );
          } else {
            tokens.push({
              type: "string",
              value: remainder.substring(0, stringMarkerLength),
            });
          }
          i += stringMarkerLength;
        }

        continue;
      }

      if (state.inString !== null) {
        const stringTplOpeningLength = this.jsTokenizer.isStringTemplateOpening(
          remainder,
          state,
        );
        if (stringTplOpeningLength > 0) {
          tokens.push({
            type: "punctuation",
            value: remainder.substring(0, stringTplOpeningLength),
          });
          state.inStringTemplateExpr++;
          i += stringTplOpeningLength;
          continue;
        }

        const stringTplClosingLength = this.jsTokenizer.isStringTemplateClosing(
          remainder,
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
            this.jsTokenizer.getStringTemplateClosingIndex(remainder);

          let langSubstring;
          if (closingIndex > -1) {
            langSubstring = remainder.substring(0, closingIndex);
          } else {
            langSubstring = remainder;
          }
          const tokenizerRv = this.tokenizeJs(tokens, langSubstring, {
            inString: null,
            inStringTemplateExpr: 0,
            inBlockComment: false,
            lexerMode: "js",
            braceDepth: state.braceDepth,
            inJsxTag: state.inJsxTag,
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
          this.jsTokenizer.lineHasBlockCommentClosing(remainder);
        if (closingIndex === -1) {
          tokens.push({ type: "comment", value: remainder });
          return { tokens, state, remainder: "" };
        }

        tokens.push({
          type: "comment",
          value: remainder.substring(0, closingIndex),
        });
        i += closingIndex; // Skip next chars as we just added them
        state.inBlockComment = false;
        continue;
      }

      if (this.jsTokenizer.isLineComment(remainder)) {
        tokens.push({ type: "comment", value: remainder });
        return { tokens, state, remainder: "" };
      }

      if (char === "{") {
        state.braceDepth += 1;
        tokens.push({ type: "punctuation", value: "{" });
        i++;
        continue;
      }

      if (char === "}") {
        state.braceDepth -= 1;
        tokens.push({ type: "punctuation", value: "}" });
        i++;
        if (state.braceDepth === -1) {
          state.lexerMode = "jsx";
          return { tokens, state, remainder: line.substring(i, line.length) };
        }
        continue;
      }

      let shouldContinue = false;
      for (let j = 0; j < this.jsTokenizer.varDeclarators.length; j++) {
        const varDeclarator = this.jsTokenizer.varDeclarators[j];
        const nextChar = remainder.charAt(varDeclarator.length);

        if (
          !remainder.startsWith(varDeclarator) ||
          !this.sepChars.includes(nextChar) ||
          !this.sepChars.includes(prevChar)
        ) {
          continue;
        }

        shouldContinue = true;
        tokens.push({
          type: "variableDeclaration",
          value: varDeclarator,
        });
        i += varDeclarator.length;
        const varDeclarationWithType = new RegExp(
          `${varDeclarator}([\\s]*)([a-zA-Z0-9_$]+)([\\s]*):([\\s]*)([<>a-zA-Z0-9{}:,\\s]+)([\\s]*)=([\\s]*)`,
        );
        const resultVarDeclarationWithType =
          varDeclarationWithType.exec(remainder);
        if (resultVarDeclarationWithType !== null) {
          const [
            ,
            declaratorNameSpace,
            varName,
            nameColonSpace,
            colonTypeSpace,
            type,
            typeEqualSpace,
            equalExprSpace,
          ] = resultVarDeclarationWithType;

          tokens.push(
            {
              type: "identifier",
              value: `${declaratorNameSpace}${varName}${nameColonSpace}`,
            },
            { type: "punctuation", value: `:${colonTypeSpace}` },
            { type: "typeHint", value: `${type}${typeEqualSpace}` },
            { type: "operator", value: `=${equalExprSpace}` },
          );
          i +=
            declaratorNameSpace.length +
            varName.length +
            nameColonSpace.length +
            1 +
            colonTypeSpace.length +
            type.length +
            typeEqualSpace.length +
            1 +
            equalExprSpace.length;
        }

        const varDeclarationWithoutType = new RegExp(
          `${varDeclarator}([\\s]*)([a-zA-Z0-9_$]+)([\\s]*)=([\\s]*)`,
        );
        const resultVarDeclarationWithoutType =
          varDeclarationWithoutType.exec(remainder);
        if (resultVarDeclarationWithoutType) {
          const [
            ,
            declaratorNameSpace,
            varName,
            varNameEqualSpace,
            equalExprSpace,
          ] = resultVarDeclarationWithoutType;
          tokens.push(
            {
              type: "identifier",
              value: `${declaratorNameSpace}${varName}${varNameEqualSpace}`,
            },
            { type: "operator", value: `=${equalExprSpace}` },
          );
          i +=
            declaratorNameSpace.length +
            varName.length +
            varNameEqualSpace.length +
            1 +
            equalExprSpace.length;
        }
      }
      if (shouldContinue) {
        continue;
      }

      if (
        this.isValidJsxTagStart(
          remainder,
          tokens.length > 0 ? tokens[tokens.length - 1] : undefined,
          state,
        )
      ) {
        state.lexerMode = "jsx";
        return { remainder, tokens, state };
      }

      if (char === " " || char === "\t") {
        tokens.push({ type: "whitespace", value: char });
        i++;
        continue;
      }

      if (
        state.inBlockComment === false &&
        state.inString === null &&
        this.jsTokenizer.isBlockCommentOpening(remainder)
      ) {
        state.inBlockComment = true;
        const closingIndex =
          this.jsTokenizer.lineHasBlockCommentClosing(remainder);

        if (closingIndex === -1) {
          tokens.push({ type: "comment", value: remainder });
          return { tokens, state, remainder: "" };
        }

        tokens.push({
          type: "comment",
          value: remainder.substring(0, closingIndex),
        });
        i += closingIndex; // Skip next chars as we just added them
        state.inBlockComment = false;
        continue;
      }

      for (let j = 0; j < this.jsTokenizer.keywords.length; j++) {
        const keyword = this.jsTokenizer.keywords[j];
        const nextChar = remainder.charAt(keyword.length);
        if (
          remainder.startsWith(keyword) &&
          this.sepChars.includes(prevChar) &&
          this.sepChars.includes(nextChar)
        ) {
          tokens.push({ type: "keyword", value: `${keyword} ` });
          i += keyword.length + 1;
          shouldContinue = true;
          break;
        }
      }

      for (let j = 0; j < this.jsTokenizer.operators.length; j++) {
        const operator = this.jsTokenizer.operators[j];

        if (remainder.startsWith(operator)) {
          tokens.push({ type: "operator", value: operator });
          i += operator.length;
          shouldContinue = true;
          break;
        }
      }

      for (let j = 0; j < this.jsTokenizer.nativeTypes.length; j++) {
        const nativeType = this.jsTokenizer.nativeTypes[j];
        const nextChar = remainder.charAt(nativeType.length);
        if (
          remainder.startsWith(nativeType) &&
          this.sepChars.includes(prevChar) &&
          this.sepChars.includes(nextChar)
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

      for (let j = 0; j < this.jsTokenizer.functionDeclarators.length; j++) {
        const funcDeclarator = this.jsTokenizer.functionDeclarators[j];
        const nextChar = remainder.charAt(funcDeclarator.length);

        if (
          remainder.startsWith(`${funcDeclarator} `) &&
          this.sepChars.includes(prevChar) &&
          this.sepChars.includes(nextChar)
        ) {
          tokens.push({
            type: "functionDeclaration",
            value: `${funcDeclarator} `,
          });
          i += funcDeclarator.length + 1;
          shouldContinue = true;
        }
      }

      for (let j = 0; j < this.jsTokenizer.numericTypes.length; j++) {
        const numericType = this.jsTokenizer.numericTypes[j];
        const nextChar = remainder.charAt(numericType.length);

        if (
          remainder.startsWith(numericType) &&
          this.sepChars.includes(prevChar) &&
          this.sepChars.includes(nextChar)
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

      if (this.jsTokenizer.punctuation.includes(char)) {
        tokens.push({ type: "punctuation", value: char });
        i++;
        continue;
      }

      const digitMatch = remainder.match(/^([0-9.]+)[\s\)\];\}\+\-*%><=,]?/);
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

    return { state, tokens, remainder: "" };
  }

  public tokenizeLine(
    line: string,
    state: JsxLexerState,
  ): {
    tokens: Token<JsxTokenType>[];
    state: JsxLexerState;
  } {
    let tokens: Token<JsxTokenType>[] = [];
    let remainder = line;

    while (remainder.length > 0) {
      if (state.lexerMode === "js") {
        ({ remainder, state, tokens } = this.tokenizeJs(
          tokens,
          remainder,
          state,
        ));
      } else if (state.lexerMode === "jsx") {
        ({ remainder, state, tokens } = this.tokenizeJsx(
          tokens,
          remainder,
          state,
        ));
      } else {
        ({ remainder, state, tokens } = this.tokenizeJs(
          tokens,
          remainder,
          state,
        ));
      }
    }
    return { state, tokens };
  }
}
