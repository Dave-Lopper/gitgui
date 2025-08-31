import * as fs from "fs";
import { parseDiff } from "./services";

const rawDiff = fs.readFileSync("sample-commit-diff.txt").toString();
const diffLines = rawDiff.split("\n");
const relevantLines = diffLines.slice(6);

const diffFiles = parseDiff(relevantLines);
console.log(diffFiles);
