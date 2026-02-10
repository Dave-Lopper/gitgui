import { CssLineTokenizer } from "./description/css.js";
import { HtmlLineTokenizer } from "./description/html.js";
import { JsonLineTokenizer } from "./description/json.js";
import { YamlLineTokenizer } from "./description/yaml.js";
import { LineTokenizer } from "./index.js";
import { ProgrammingLangLineTokenizer } from "./programming/index.js";
import { JsxLineTokenizer } from "./programming/jsx.js";
import { GolangTokenizer } from "./programming/languages/golang.js";
import { JavascriptTokenizer } from "./programming/languages/javascript.js";
import { PythonTokenizer } from "./programming/languages/python.js";

export const TOKENIZERS = new Map<string, LineTokenizer<unknown, unknown>>();
TOKENIZERS.set(
  "js",
  new ProgrammingLangLineTokenizer(new JavascriptTokenizer()),
);
TOKENIZERS.set(
  "cjs",
  new ProgrammingLangLineTokenizer(new JavascriptTokenizer()),
);
TOKENIZERS.set(
  "mjs",
  new ProgrammingLangLineTokenizer(new JavascriptTokenizer()),
);
TOKENIZERS.set(
  "ts",
  new ProgrammingLangLineTokenizer(new JavascriptTokenizer()),
);
TOKENIZERS.set("json", new JsonLineTokenizer());
TOKENIZERS.set("py", new ProgrammingLangLineTokenizer(new PythonTokenizer()));
TOKENIZERS.set("go", new ProgrammingLangLineTokenizer(new GolangTokenizer()));
TOKENIZERS.set("html", new HtmlLineTokenizer());
TOKENIZERS.set("xml", new HtmlLineTokenizer());
TOKENIZERS.set("css", new CssLineTokenizer());
TOKENIZERS.set("scss", new CssLineTokenizer());
TOKENIZERS.set("sass", new CssLineTokenizer());
TOKENIZERS.set("yaml", new YamlLineTokenizer());
TOKENIZERS.set("yml", new YamlLineTokenizer());
TOKENIZERS.set("jsx", new JsxLineTokenizer());
TOKENIZERS.set("tsx", new JsxLineTokenizer());
