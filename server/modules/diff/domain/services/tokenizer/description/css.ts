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
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "fieldcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "legeng",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "menu",
    "meta",
    "meter",
    "nav",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "search",
    "section",
    "select",
    "small",
    "span",
    "strong",
    "sub",
    "summary",
    "sup",
    "svg",
    "table",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
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

      if ([".", "#"].includes(char)) {
        const remainder = toProcess.substring(1, toProcess.length);

        let separator;
        for (let j = 0; j < remainder.length; j++) {
          const char = remainder.charAt(j);
          if ([" ", ".", "#"].includes(char)) {
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

      if (char === " ") {
        tokens.push({ type: "whitespace", value: " " });
        i++;
        continue;
      }

      if (["{", "}", ":", ";"].includes(char)) {
        tokens.push({ type: "punctuation", value: char });
        i++;
        continue;
      }

      if (tokens.length > 0 && tokens[tokens.length - 1].type === "unknown") {
        tokens[tokens.length - 1].value += char;
      } else {
        tokens.push({ type: "unknown", value: char });
      }
    }
    return { tokens, state };
  }
}
