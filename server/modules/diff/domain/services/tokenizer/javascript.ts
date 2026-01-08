import { LanguageSpecificTokenizer, LexerState } from ".";

export class JavascriptTokenizer implements LanguageSpecificTokenizer {
  public readonly functionDeclarators = ["function"];
  public readonly nativeTypes = [
    "number",
    "boolean",
    "string",
    "Array",
    "Object",
  ];
  public readonly numericTypes = ["false", "true", "undefined", "null"];
  public readonly operators = [
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
    "|",
  ];
  public readonly punctuation = [
    ";",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    ":",
    ".",
    ",",
  ];
  public readonly keywords = [
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
  public readonly stringClosersMapping = { "'": "'", '"': '"', "`": "`" };
  public readonly varDeclarators = ["var", "let", "const"];

  public isBlockCommentOpening(value: string): number {
    if (value.startsWith("/*")) {
      return 2;
    }
    return 0;
  }

  public isBlockCommentClosing(value: string): number {
    if (value.startsWith("*/")) {
      return 2;
    }
    return 0;
  }

  public isLineComment(value: string): boolean {
    return value.startsWith("//");
  }

  public isStringMarker(value: string): number {
    if (
      value.startsWith("'") ||
      value.startsWith('"') ||
      value.startsWith("`")
    ) {
      return 1;
    }
    return 0;
  }

  public isStringTemplateOpening(value: string, state: LexerState): number {
    if (state.inString === "`" && value.startsWith("${")) {
      return 2;
    }
    return 0;
  }

  public isStringTemplateClosing(value: string, state: LexerState): number {
    if (state.inString === "`" && value.startsWith("}")) {
      return 1;
    }
    return 0;
  }

  public lineHasBlockCommentClosing(value: string): number {
    const index = value.indexOf("*/");
    return index === -1 ? -1 : index + 2;
  }
}
