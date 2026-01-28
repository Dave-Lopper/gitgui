import { LanguageSpecificLexer, ProgrammingLangLexerState } from "..";

export class PythonTokenizer implements LanguageSpecificLexer {
  public readonly functionDeclarators = ["def", "lambda"];
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
    "and",
    "or",
    "not",
    "in",
    "is",
    "&",
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
    "elif",
    "for",
    "while",
    "return",
    "class",
    "try",
    "except",
    "finally",
    "raise",
    "import",
    "from",
    "async",
    "await",
    "case",
    "break",
    "continue",
    "assert",
    "as",
    "del",
    "global",
    "match",
    "nonlocal",
    "pass",
    "with",
    "yield",
  ];
  public readonly stringClosersMapping = {
    'r"""': '"""',
    'f"""': '"""',
    'b"""': '"""',
    "r'''": "'''",
    "f'''": "'''",
    "b'''": "'''",
    '"""': '"""',
    "'''": "'''",
    'f"': '"',
    'r"': '"',
    'b"': '"',
    "f'": "'",
    "r'": "'",
    "b'": "'",
    "'": "'",
    '"': '"',
  };
  public readonly varDeclarators = [];

  public getStringTemplateClosingIndex(value: string): number {
    return value.indexOf("}");
  }

  // Handled by multi-line string
  public isBlockCommentOpening(value: string): number {
    return 0;
  }

  // Handled by multi-line string
  public isBlockCommentClosing(value: string): number {
    return 0;
  }

  public isLineComment(value: string): boolean {
    return value.startsWith("#");
  }

  public isStringMarker(value: string): number {
    for (let stringOpener of Object.keys(this.stringClosersMapping)) {
      if (value.startsWith(stringOpener)) {
        return stringOpener.length;
      }
    }
    return 0;
  }

  public isStringTemplateOpening(
    value: string,
    state: ProgrammingLangLexerState,
  ): number {
    if (
      state.inString !== null &&
      ["f'", "f'''", 'f"', 'f"""'].includes(state.inString) &&
      value.startsWith("{")
    ) {
      return 1;
    }
    return 0;
  }

  public isStringTemplateClosing(
    value: string,
    state: ProgrammingLangLexerState,
  ): number {
    if (
      state.inString !== null &&
      ["f'", "f'''", 'f"', 'f"""'].includes(state.inString) &&
      value.startsWith("}")
    ) {
      return 1;
    }
    return 0;
  }

  // Python doesn't have this
  public lineHasBlockCommentClosing(value: string): number {
    return 0;
  }
}
