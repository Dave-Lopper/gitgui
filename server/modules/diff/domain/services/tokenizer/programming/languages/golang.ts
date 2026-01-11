import { LanguageSpecificLexer, ProgrammingLangLexerState } from "..";

export class GolangTokenizer implements LanguageSpecificLexer {
  public readonly functionDeclarators = ["func"];
  public readonly nativeTypes = [
    "int",
    "float",
    "bool",
    "str",
    "list",
    "dict",
    "tuple",
    "set",
  ];
  public readonly numericTypes = ["False", "True", "None"];
  public readonly operators = [
    "=",
    "==",
    "!=",
    "<",
    "<=",
    ">",
    ">=",
    "/",
    "*",
    "-",
    "+",
    "%",
    "&",
    "|",
    "!",
    "^",
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
    "break",
    "chan",
    "continue",
    "default",
    "defer",
    "else",
    "fallthrough",
    "for",
    "go",
    "goto",
    "if",
    "import",
    "interface",
    "map",
    "package",
    "range",
    "return",
    "select",
    "struct",
    "switch",
    "type",
    "var",
  ];
  public readonly stringClosersMapping = {
    '"': '"',
  };
  public readonly varDeclarators = [];

  // Handled by multi-line string
  public isBlockCommentOpening(value: string): number {
    if (value.startsWith("/*")) {
      return 2;
    }
    return 0;
  }

  // Handled by multi-line string
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
    if (value.startsWith('"')) {
      return 1;
    }
    return 0;
  }

  public isStringTemplateOpening(
    value: string,
    state: ProgrammingLangLexerState,
  ): number {
    return 0;
  }

  public isStringTemplateClosing(
    value: string,
    state: ProgrammingLangLexerState,
  ): number {
    return 0;
  }

  public lineHasBlockCommentClosing(value: string): number {
    const index = value.indexOf("*/");
    return index === -1 ? -1 : index + 2;
  }
}
