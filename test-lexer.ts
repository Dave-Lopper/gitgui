import { writeFileSync } from "fs";

import {
  LexerState,
  TokenType,
} from "./server/modules/diff/domain/services/lexers";
import {
  JavascriptStringMarkers,
  tokenizeLine,
} from "./server/modules/diff/domain/services/lexers/javascript";

const snippet = `export function parseFileNumStat(line: string): number[] {
  const matches = line.trimEnd().match(/^([\d-]+)\s+([\d-]+)\s+(.+)$/);
  if (!matches) {
    throw new Error("Numstat line unexpectedly formed");
  }

  const [, added, removed, _] = matches;
  return [parseInt(added), parseInt(removed)];
}`;
const snippet2 = `import { LexerState, Token } from ".";

const KEYWORDS = [
  "if",
  "else",
  "for",
  "while",
  "do",
  "return",
  "class",
  "extends",
  "new",
  "try",
  "catch",
  "finally",
  "throw",
  "import",
  "export",
  "from",
  "async",
  "await",
  "switch",
  "case",
  "break",
  "continue",
  "default",
  "typeof",
  "instanceof",
];

const NATIVETYPES = [
  "number",
  "boolean",
  "string",
  "Array",
  "Object",
  "undefined",
  "null",
];

const OPERATORS = [
  "=",
  "==",
  "===",
  "!=",
  "!==",
  "!",
  "<",
  "<=",
  ">",
  ">=",
  "/",
  "*",
  "-",
  "+",
  "%",
  "&&",
  "||",
];

const VAR_DECLARATORS = ["const", "var", "let"];

export type JavascriptStringMarkers = "'" | "" | '"';

function isStringMarker(value: string): value is JavascriptStringMarkers {
  return value === "'" || value === "" || value === '"';
}

const PUNCTUATION = new Set([";", "(", ")", "[", "]", "{", "}", ":", ".", ","]);

export function tokenizeLine(
  line: string,
  lexerState: LexerState<JavascriptStringMarkers>,
): { tokens: Token[]; state: LexerState<JavascriptStringMarkers> } {
  const tokens: Token[] = [];
  const state = { ...lexerState };
  let toProcess = line;
  let i = 0;

  while (toProcess.length > 0) {
    const char = line.charAt(i);
    const nextChar = line.charAt(i + 1);
    toProcess = line.substring(i, line.length);

    if (isStringMarker(char)) {
      if (state.inString === char) {
        state.inString = null;
        tokens.push({ type: "punctuation", value: char });
      } else if (state.inString === null) {
        state.inString = char;
        tokens.push(
          { type: "punctuation", value: char },
          { type: "string", value: "" },
        );
      } else {
        tokens[tokens.length - 1].value += char;
      }
      i++;
      continue;
    }

    if (state.inString !== null) {
      if (state.inString === "" && char === "$" && nextChar === "{") {
        tokens.push({ type: "punctuation", value: "\$\{" });
        state.inStringTemplateExpr = 1;
        i++; // Skip next char as we just added it
        continue;
      }

      if (
        state.inString === "" &&
        state.inStringTemplateExpr > 0 &&
        char === "}"
      ) {
        tokens.push({ type: "punctuation", value: char });
        state.inStringTemplateExpr -= 1;
        continue;
      }

      tokens[tokens.length - 1].value += char;
      i++;
      continue;
    }

    if (char === "/" && nextChar === "/") {
      tokens.push({ type: "comment", value: toProcess });
      return { tokens, state };
    }

    if (char === " " || char === "\t") {
      tokens.push({ type: "whitespace", value: char });
      i++;
      continue;
    }

    if (state.inBlockComment === false && char === "/" && nextChar === "*") {
      state.inBlockComment = true;
      const closingIndex = toProcess.indexOf("*/");

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
    for (let j = 0; j < KEYWORDS.length; j++) {
      if (toProcess.startsWith(KEYWORDS[j])) {
        tokens.push({ type: "keyword", value: KEYWORDS[j] });
        i += KEYWORDS[j].length + 1;
        shouldContinue = true;
        break;
      }
    }

    for (let j = 0; j < OPERATORS.length; j++) {
      if (toProcess.startsWith(OPERATORS[j])) {
        tokens.push({ type: "operator", value: OPERATORS[j] });
        i++;
        shouldContinue = true;
        break;
      }
    }

    for (let j = 0; j < VAR_DECLARATORS.length; j++) {
      if (toProcess.startsWith(VAR_DECLARATORS[j])) {
        tokens.push({
          type: "variableDeclaration",
          value: VAR_DECLARATORS[j]},
        });
        i += VAR_DECLARATORS[j].length + 1;
        shouldContinue = true;
        break;
      }
    }

    for (let j = 0; j < NATIVETYPES.length; j++) {
      if (
        toProcess.startsWith(NATIVETYPES[j]) &&
        (!toProcess.charAt(NATIVETYPES[j].length) ||
          PUNCTUATION.has(toProcess.charAt(NATIVETYPES[j].length)) ||
          toProcess.charAt(NATIVETYPES[j].length) === " ")
      ) {
        tokens.push({
          type: "typeHint",
          value: NATIVETYPES[j],
        });
        i += NATIVETYPES[j].length;
        shouldContinue = true;
        break;
      }
    }

    if (shouldContinue) {
      continue;
    }

    if (PUNCTUATION.has(char)) {
      tokens.push({ type: "punctuation", value: char });
      i++;
      continue;
    }

    if (toProcess.startsWith("function ")) {
      tokens.push({ type: "functionDeclaration", value: "function " });
      i += 9;
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

  return { tokens, state };
}`;

const lines = snippet2.split("\n");
const snippetTokens = [];
let lexerState: LexerState<JavascriptStringMarkers> = {
  inBlockComment: false,
  inString: null,
  inStringTemplateExpr: 0,
};

for (let i = 0; i < lines.length; i++) {
  const rv = tokenizeLine(lines[i], lexerState);

  lexerState = rv.state;
  snippetTokens.push(rv.tokens);
}

let rendered = "";

const colors: Record<TokenType, string> = {
  punctuation: "#797979",
  comment: "#797979",
  unknown: "#d6d6d6",
  identifier: "#d6d6d6",
  whitespace: "#d6d6d6",
  string: "#e5b567",
  functionDeclaration: "#6c99bb",
  variableDeclaration: "#6c99bb",
  typeHint: "#98d1bc",
  keyword: "#b05279",
  operator: "#b05279",
  number: "#9e86c8",
};

for (let i = 0; i < snippetTokens.length; i++) {
  const line = snippetTokens[i];

  rendered += `<div style="display: flex; flex-direction: row; justify-content: flex-start;">`;

  for (let j = 0; j < line.length; j++) {
    const token = line[j];

    rendered += `<span style="color: ${colors[token.type]}"><pre>${token.value}</pre></span>`;
  }
  rendered += "</div>";
}

const finalHtml = `<div style="background-color: #2e2e2e; display: flex; flex-direction: column">${rendered}</div>`;
writeFileSync("syntax-highlighted.html", finalHtml);
