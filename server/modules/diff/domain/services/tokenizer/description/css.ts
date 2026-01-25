import { LineTokenizer, Token } from "../index.js";

export type CssTokenType =
  | "tagName"
  | "className"
  | "id"
  | "string"
  | "attrName"
  | "punctuation"
  | "property"
  | "propertyValue"
  | "whitespace"
  | "unknown";

export type CssLexerState = {};

export class CssLineTokenizer
  implements LineTokenizer<CssTokenType, CssLexerState>
{
  public readonly initialState: CssLexerState = {};

  private readonly HTML_TAGS = [
    "fieldcaption",
    "blockquote",
    "colgroup",
    "datalist",
    "fieldset",
    "optgroup",
    "progress",
    "template",
    "textarea",
    "address",
    "article",
    "caption",
    "details",
    "picture",
    "section",
    "summary",
    "canvas",
    "dialog",
    "figure",
    "footer",
    "header",
    "hgroup",
    "iframe",
    "legeng",
    "object",
    "option",
    "output",
    "search",
    "select",
    "strong",
    "aside",
    "audio",
    "embed",
    "input",
    "label",
    "meter",
    "param",
    "small",
    "table",
    "tfoot",
    "thead",
    "title",
    "track",
    "video",
    "abbr",
    "area",
    "base",
    "body",
    "cite",
    "code",
    "data",
    "form",
    "head",
    "html",
    "link",
    "main",
    "mark",
    "menu",
    "meta",
    "ruby",
    "samp",
    "span",
    "time",
    "bdi",
    "bdo",
    "col",
    "del",
    "dfn",
    "div",
    "img",
    "ins",
    "kbd",
    "map",
    "nav",
    "pre",
    "sub",
    "sup",
    "svg",
    "var",
    "wbr",
    "dd",
    "dl",
    "dt",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "li",
    "ol",
    "rp",
    "rt",
    "td",
    "th",
    "tr",
    "ul",
    "a",
    "b",
    "i",
    "p",
    "q",
    "s",
    "u",
  ];

  public tokenizeLine(
    line: string,
    state: CssLexerState,
  ): { tokens: Token<CssTokenType>[]; state: CssLexerState } {
    let toProcess = line;
    let i = 0;
    const tokens: Token<CssTokenType>[] = [];

    while (toProcess.length > 0) {
      toProcess = line.substring(i, line.length);
      const char = toProcess.charAt(0);
      let foundHtmlTag = false;

      const atRuleRegex = /^(\s*)(@[a-zA-Z0-9-_]+) /;
      const atRuleRegexMatch = toProcess.match(atRuleRegex);
      if (atRuleRegexMatch !== null && atRuleRegexMatch[2].length > 0) {
        if (atRuleRegexMatch[1].length > 0) {
          tokens.push({ type: "whitespace", value: atRuleRegexMatch[1] });
          i += atRuleRegexMatch[1].length;
        }

        tokens.push({ type: "tagName", value: atRuleRegexMatch[2] });
        i += atRuleRegexMatch[2].length;

        let foundEndChar = false;
        const startingIndex =
          atRuleRegexMatch[1].length + atRuleRegexMatch[2].length;

        for (let endChar of ["{", ";"]) {
          const charIndex = toProcess.indexOf(endChar);
          if (charIndex > -1) {
            const remainder = toProcess.substring(startingIndex, charIndex);
            tokens.push(
              { type: "propertyValue", value: remainder },
              { type: "punctuation", value: endChar },
            );
            i += remainder.length + 1;
            foundEndChar = true;
          }
        }

        // Accomodate sass syntax
        if (!foundEndChar) {
          const remainder = toProcess.substring(
            startingIndex,
            toProcess.length,
          );
          tokens.push({ type: "propertyValue", value: remainder });
          i += remainder.length;
        }

        continue;
      }

      const colonIndex = toProcess.indexOf(":");
      if (colonIndex > -1) {
        const [propName, propVal] = toProcess.split(":");
        tokens.push(
          { type: "property", value: propName },
          { type: "punctuation", value: ":" },
          {
            type: "propertyValue",
            value: propVal.endsWith(";")
              ? propVal.substring(0, propVal.length - 1)
              : propVal,
          },
        );
        if (toProcess.trimEnd().endsWith(";")) {
          tokens.push({ type: "punctuation", value: ";" });
        }
        return { tokens, state };
      }

      const equalIndex = toProcess.indexOf("=");
      if (equalIndex > -1) {
        const attrName = toProcess.substring(0, equalIndex);
        tokens.push(
          { type: "attrName", value: attrName },
          { type: "punctuation", value: "=" },
        );
        i += attrName.length + 1;

        const closingIndex = toProcess.indexOf("]");
        let attrValue;
        if (closingIndex > -1) {
          attrValue = toProcess.substring(equalIndex + 1, closingIndex);
        } else {
          attrValue = toProcess.substring(equalIndex + 1, toProcess.length);
        }

        tokens.push({ type: "string", value: attrValue });
        i += attrValue.length;
        continue;
      }

      for (let j = 0; j < this.HTML_TAGS.length; j++) {
        const htmlTag = this.HTML_TAGS[j];

        if (toProcess.startsWith(htmlTag)) {
          tokens.push({ type: "tagName", value: htmlTag });
          i += htmlTag.length;
          foundHtmlTag = true;
          break;
        }
      }
      if (foundHtmlTag) {
        continue;
      }

      if (char === "[") {
        tokens.push({ type: "punctuation", value: "[" });
        i++;
        const closingIndex = toProcess.indexOf("]");

        if (closingIndex > -1) {
          const attr = toProcess.substring(1, closingIndex);
          const equalIndex = attr.indexOf("=");

          if (equalIndex > -1) {
            const [attrName, attrVal] = attr.split("=");
            tokens.push(
              { type: "attrName", value: attrName },
              { type: "string", value: attrVal },
            );
          } else {
            tokens.push({ type: "attrName", value: attr });
          }
          tokens.push({ type: "punctuation", value: "]" });
          i += attr.length + 1;
        }
        continue;
      }

      if (char === "]") {
        tokens.push({ type: "punctuation", value: "]" });
        i++;
        continue;
      }

      if ([".", "#"].includes(char)) {
        const remainder = toProcess.substring(1, toProcess.length);

        let separator;
        for (let j = 0; j < remainder.length; j++) {
          const char = remainder.charAt(j);
          if ([" ", ".", "#", ","].includes(char)) {
            separator = char;
            break;
          }
        }

        let name;
        if (separator !== undefined) {
          name = remainder.substring(0, remainder.indexOf(separator));
        } else {
          name = remainder;
        }

        tokens.push(
          { type: "punctuation", value: char },
          {
            type: char === "." ? "className" : "id",
            value: name,
          },
        );
        i += 1 + name.length;
        continue;
      }

      if (char === ":") {
        tokens.push({ type: "punctuation", value: ":" });
        i++;
        continue;
      }

      if (char === " ") {
        tokens.push({ type: "whitespace", value: " " });
        i++;
        continue;
      }

      if (["{", "}", ";", ","].includes(char)) {
        tokens.push({ type: "punctuation", value: char });
        i++;
        continue;
      }

      if (char === "=") {
        tokens.push({ type: "punctuation", value: "=" });
        i++;
        continue;
      }

      if (tokens.length > 0 && tokens[tokens.length - 1].type === "unknown") {
        tokens[tokens.length - 1].value += char;
        i++;
      } else {
        tokens.push({ type: "unknown", value: char });
        i++;
      }
    }
    return { tokens, state };
  }
}
