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

export type CssLexerState = {
  nextToken: CssTokenType;
};

export class CssLineTokenizer
  implements LineTokenizer<CssTokenType, CssLexerState>
{
  public readonly initialState: CssLexerState = { nextToken: "property" };

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

      const colonIndex = toProcess.indexOf(":");
      if (colonIndex > -1 && toProcess.trimEnd().endsWith(";")) {
        const [propName, propVal] = toProcess.split(":");
        tokens.push(
          { type: "property", value: propName },
          { type: "punctuation", value: ":" },
          {
            type: "propertyValue",
            value: propVal.substring(0, propVal.length - 1),
          },
          { type: "punctuation", value: ";" },
        );
        return { tokens, state };
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
          continue;
        }

        state.nextToken = "attrName";
      }

      if (char === "]") {
        tokens.push({ type: "punctuation", value: "]" });
        state.nextToken = "property";
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
        state.nextToken = "propertyValue";
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
        if (state.nextToken === "attrName") {
          state.nextToken = "string";
        }
        tokens.push({ type: "punctuation", value: "=" });
        i++;
        continue;
      }

      if (
        tokens.length > 0 &&
        tokens[tokens.length - 1].type === state.nextToken
      ) {
        tokens[tokens.length - 1].value += char;
        i++;
      } else {
        tokens.push({ type: state.nextToken, value: char });
        i++;
      }
    }
    return { tokens, state };
  }
}
