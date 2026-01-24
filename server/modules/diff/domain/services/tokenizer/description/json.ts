import { LineTokenizer, Token } from "../index.js";

export type JsonTokenType =
  | "key"
  | "string"
  | "number"
  | "punctuation"
  | "whitespace"
  | "unknown";

export type JsonLexerState = {};

export class JsonLineTokenizer
  implements LineTokenizer<JsonTokenType, JsonLexerState>
{
  public readonly initialState: JsonLexerState = {};

  public tokenizeLine(
    line: string,
    state: JsonLexerState,
  ): { tokens: Token<JsonTokenType>[]; state: JsonLexerState } {
    let toProcess = line;
    let i = 0;
    const tokens: Token<JsonTokenType>[] = [];

    while (toProcess.length > 0) {
      toProcess = line.substring(i, line.length);
      const char = toProcess.charAt(0);

      if (char === '"') {
        tokens.push({ type: "punctuation", value: '"' });
        i++;

        const quoteTrimmed = toProcess.substring(1);
        const closingIndex = quoteTrimmed.indexOf('"');

        if (closingIndex > -1) {
          const keyName = quoteTrimmed.substring(0, closingIndex);
          tokens.push(
            {
              type: "string",
              value: keyName,
            },
            { type: "punctuation", value: '"' },
          );
          i += keyName.length + 1;
        }
        continue;
      }

      if (toProcess.startsWith("true")) {
        tokens.push({ type: "number", value: "true" });
        i += 4;
        continue;
      }

      if (toProcess.startsWith("false")) {
        tokens.push({ type: "number", value: "false" });
        i += 5;
        continue;
      }

      const digitMatch = toProcess.match(/^([0-9.]+)[\s\)\];\}\+\-*%><=,]?/);
      if (digitMatch && digitMatch[1] && digitMatch[1].length > 0) {
        tokens.push({ type: "number", value: digitMatch[1] });
        i += digitMatch[1].length;
        continue;
      }

      if ([":", ",", "[", "]", "{", "}"].includes(char)) {
        tokens.push({ type: "punctuation", value: char });
        i++;
        continue;
      }

      if (tokens.length > 0 && tokens[tokens.length - 1].type === "unknown") {
        tokens.push({ type: "unknown", value: char });
      } else {
        tokens[tokens.length - 1].value += char;
      }
      i++;
    }
    return { tokens, state };
  }
}
