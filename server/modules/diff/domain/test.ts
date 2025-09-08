import * as fs from "fs";
import { parseDiff } from "./services";
import { diff } from "util";

const rawDiff = fs.readFileSync("diff.log").toString();
const diffLines = rawDiff.split("\n");
const relevantLines = diffLines.slice(6);

const diffFiles = parseDiff(relevantLines);
const diffData = JSON.stringify(diffFiles);
fs.writeFileSync("diff-serialized-sample-5.json", diffData);
// console.log(diffFiles);
