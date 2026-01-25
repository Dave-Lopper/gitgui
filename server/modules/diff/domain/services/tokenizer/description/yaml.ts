import { LineTokenizer, Token } from "../index.js";

export type JsonTokenType =
  | "key"
  | "string"
  | "number"
  | "punctuation"
  | "whitespace"
  | "comment"
  | "unknown";

export type YamlLexerState = {};

export class YamlLineTokenizer
  implements LineTokenizer<JsonTokenType, YamlLexerState>
{
  public readonly initialState: YamlLexerState = {};

  public tokenizeLine(
    line: string,
    state: YamlLexerState,
  ): { tokens: Token<JsonTokenType>[]; state: YamlLexerState } {
    let toProcess = line;
    let i = 0;
    const tokens: Token<JsonTokenType>[] = [];
    const sepChars = [" ", ",", undefined];

    while (toProcess.length > 0) {
      toProcess = line.substring(i, line.length);
      if (toProcess.length === 0) {
        break;
      }
      const char = toProcess.charAt(0);
      const prevChar = line.charAt(i - 1);

      if (toProcess.startsWith(" #") || line.startsWith("#")) {
        tokens.push({ type: "comment", value: toProcess });
        i += toProcess.length;
        continue;
      }

      const colonIndex = toProcess.indexOf(":");
      if (
        (colonIndex > -1 && toProcess.charAt(colonIndex + 1) === " ") ||
        colonIndex === toProcess.length - 1
      ) {
        const key = toProcess.substring(0, colonIndex);
        tokens.push(
          { type: "key", value: key },
          { type: "punctuation", value: ":" },
        );
        i += key.length + 1;
        continue;
      }

      if (char === '"' || char === "'") {
        tokens.push({ type: "punctuation", value: char });
        i++;

        const quoteTrimmed = toProcess.substring(1);
        const closingIndex = quoteTrimmed.indexOf(char);

        if (closingIndex > -1) {
          const stringContents = quoteTrimmed.substring(0, closingIndex);
          tokens.push(
            {
              type: "string",
              value: stringContents,
            },
            { type: "punctuation", value: char },
          );
          i += stringContents.length + 1;
        }
        continue;
      }

      if (["[", "]"].includes(char)) {
        tokens.push({ type: "punctuation", value: char });
        i++;
        continue;
      }

      if (
        toProcess.toLowerCase().startsWith("true") &&
        sepChars.includes(prevChar) &&
        sepChars.includes(toProcess.charAt(4))
      ) {
        tokens.push({ type: "number", value: toProcess.substring(0, 3) });
        i += 4;
        continue;
      }

      if (
        toProcess.toLowerCase().startsWith("false") &&
        sepChars.includes(prevChar) &&
        sepChars.includes(toProcess.charAt(5))
      ) {
        tokens.push({ type: "number", value: "false" });
        i += 5;
        continue;
      }

      const digitMatch = toProcess.match(/^([0-9.]+)[\s\],]?/);
      if (digitMatch && digitMatch[1] && digitMatch[1].length > 0) {
        tokens.push({ type: "number", value: digitMatch[1] });
        i += digitMatch[1].length;
        continue;
      }

      if (tokens.length > 0 && tokens[tokens.length - 1].type === "string") {
        tokens[tokens.length - 1].value += char;
      } else {
        tokens.push({ type: "string", value: char });
      }
      i++;
    }
    return { tokens, state };
  }
}
