import { LineTokenizer, Token } from "../index.js";
import {
  ProgrammingLangLineTokenizer,
  ProgrammingLangTokenType,
} from "../programming/index.js";
import { JavascriptTokenizer } from "../programming/languages/javascript.js";

export type HtmlSpecificTokenType =
  | "tagName"
  | "attribute"
  | "string"
  | "punctuation";

export type HtmlTokenType = HtmlSpecificTokenType | ProgrammingLangTokenType;

export type HtmlLexerState = {
  isInCssTag: boolean;
  isOpeningCssTag: boolean;
  isOpeningJavascriptTag: boolean;
  isInJavascriptTag: boolean;
  isInHtmlTag: boolean;
  inString: string | null;
};

export class HtmlLineTokenizer
  implements LineTokenizer<HtmlTokenType, HtmlLexerState>
{
  public readonly initialState: HtmlLexerState = {
    isInCssTag: false,
    isOpeningCssTag: false,
    isOpeningJavascriptTag: false,
    isInJavascriptTag: false,
    isInHtmlTag: false,
    inString: null,
  };

  public tokenizeLine(
    line: string,
    state: HtmlLexerState,
  ): { tokens: Token<HtmlTokenType>[]; state: HtmlLexerState } {
    const jsTokenizer = new ProgrammingLangLineTokenizer(
      new JavascriptTokenizer(),
    );
    const tokens: Token<HtmlTokenType>[] = [];

    let toProcess = line;
    let i = 0;

    while (toProcess.length > 0) {
      toProcess = line.substring(i, line.length);
      const char = line.charAt(i);
      const nextChar = line.charAt(i + 1);

      if (char === "<" && nextChar.match(/[a-zA-Z]/i)) {
        const tagName = toProcess.split(" ")[0].substring(1);
        i += tagName.length + 1;
        tokens.push({ type: "punctuation", value: "<" });
        tokens.push({ type: "tagName", value: tagName });
        state.isInHtmlTag = true;
        continue;
      }

      if (char === ">" && state.isInHtmlTag === true) {
        tokens.push({ type: "punctuation", value: ">" });
        state.isInHtmlTag = false;

        if (state.isOpeningJavascriptTag === true) {
          state.isInJavascriptTag = true;
          state.isOpeningJavascriptTag = false;
        }

        i++;
        continue;
      }

      if (char === "/" && nextChar === ">" && state.isInHtmlTag === true) {
        tokens.push({ type: "punctuation", value: "/>" });
        state.isInHtmlTag = false;

        if (state.isOpeningJavascriptTag === true) {
          state.isOpeningJavascriptTag = false;
        }

        i += 2;
        continue;
      }

      if (
        char.match(/[a-zA-Z]/i) &&
        state.isInHtmlTag === true &&
        state.inString === null
      ) {
        const toNextSpace = toProcess.split(" ")[0];
        const equalIndex = toNextSpace.indexOf("=");
        let attrName;

        if (equalIndex > -1) {
          attrName = toNextSpace.substring(0, equalIndex);
        } else {
          attrName = toNextSpace;
        }

        tokens.push({ type: "attribute", value: attrName });
        i += attrName.length;
        continue;
      }

      if (char === '"' && state.isInHtmlTag === true) {
        state.inString = '"';
        const quoteTrimmed = toProcess.substring(1);
        const closingIndex = quoteTrimmed.indexOf('"');
        if (closingIndex > -1) {
          const stringRemained = quoteTrimmed.substring(0, closingIndex);
          tokens.push({
            type: "string",
            value: `"${stringRemained}`,
          });
          i += stringRemained.length + 1;
        } else {
          tokens.push({ type: "string", value: toProcess });
          i += toProcess.length;
        }
        continue;
      }

      if (char === "{" && state.isInHtmlTag === true) {
        state.isInJavascriptTag = true;
        tokens.push({ type: "punctuation", value: "{" });
        i += 1;
        continue;
      }

      if (toProcess.startsWith("<script")) {
        tokens.push({ type: "punctuation", value: "<" });
        tokens.push({ type: "tagName", value: "script" });
        state.isOpeningJavascriptTag = true;
        state.isInHtmlTag = true;
        i += 7;
      }

      const jsTagClosingIndex = toProcess.indexOf("</script>");
      if (state.isInJavascriptTag === true && jsTagClosingIndex > -1) {
        const jsPart = toProcess.substring(0, jsTagClosingIndex);
        tokens.push(
          ...jsTokenizer.tokenizeLine(jsPart, {
            inBlockComment: false,
            inString: null,
            inStringTemplateExpr: 0,
          }).tokens,
        );
        i += jsPart.length;

        tokens.push({ type: "punctuation", value: "</" });
        tokens.push({ type: "keyword", value: "script" });
        tokens.push({ type: "punctuation", value: ">" });
        i += "</script>".length;
        state.isInJavascriptTag = false;
        continue;
      } else if (state.isInJavascriptTag === true) {
        tokens.push(
          ...jsTokenizer.tokenizeLine(toProcess, {
            inBlockComment: false,
            inString: null,
            inStringTemplateExpr: 0,
          }).tokens,
        );
        i += toProcess.length;
        continue;
      }

      if (
        state.isInCssTag === false &&
        state.isInJavascriptTag === false &&
        state.isInHtmlTag === false
      ) {
        if (tokens[tokens.length - 1].type === "unknown") {
          tokens[tokens.length - 1].value += char;
        } else {
          tokens.push({ type: "unknown", value: char });
        }
        i++;
        continue;
      }
    }

    return { state, tokens };
  }
}
