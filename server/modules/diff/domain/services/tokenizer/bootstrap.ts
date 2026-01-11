import { CssLineTokenizer } from "./description/css.js";
import { HtmlLineTokenizer } from "./description/html.js";
import { LineTokenizer } from "./index.js";
import { ProgrammingLangLineTokenizer } from "./programming/index.js";
import { GolangTokenizer } from "./programming/languages/golang.js";
import { JavascriptTokenizer } from "./programming/languages/javascript.js";
import { PythonTokenizer } from "./programming/languages/python.js";

export const TOKENIZERS = new Map<string, LineTokenizer<unknown, unknown>>();
TOKENIZERS.set(
  "js",
  new ProgrammingLangLineTokenizer(new JavascriptTokenizer()),
);
TOKENIZERS.set(
  "ts",
  new ProgrammingLangLineTokenizer(new JavascriptTokenizer()),
);
TOKENIZERS.set("py", new ProgrammingLangLineTokenizer(new PythonTokenizer()));
TOKENIZERS.set("go", new ProgrammingLangLineTokenizer(new GolangTokenizer()));
TOKENIZERS.set("html", new HtmlLineTokenizer());
TOKENIZERS.set("css", new CssLineTokenizer());
