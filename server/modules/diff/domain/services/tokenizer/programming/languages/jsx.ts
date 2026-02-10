import { LanguageSpecificLexer, ProgrammingLangLexerState } from "..";

export class JavascriptTokenizer implements LanguageSpecificLexer {
  public readonly functionDeclarators = ["function"];
  public readonly nativeTypes = [
    "number",
    "boolean",
    "string",
    "Map",
    "Set",
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
    "implements",
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
    "abstract",
    "final",
    "eval",
    "private",
  ];
  public readonly stringClosersMapping = { "'": "'", '"': '"', "`": "`" };
  public readonly varDeclarators = ["var", "let", "const"];

  public getStringTemplateClosingIndex(value: string): number {
    return value.indexOf("}");
  }

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

  public isStringTemplateOpening(
    value: string,
    state: ProgrammingLangLexerState,
  ): number {
    if (state.inString === "`" && value.startsWith("${")) {
      return 2;
    }
    return 0;
  }

  public isStringTemplateClosing(
    value: string,
    state: ProgrammingLangLexerState,
  ): number {
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
