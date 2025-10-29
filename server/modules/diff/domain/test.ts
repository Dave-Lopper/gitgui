// import * as fs from "fs";
// import { diff } from "util";

// import { parseDiff } from "./services-2";

// const rawDiff = fs.readFileSync("diff.log").toString();
// const diffLines = rawDiff.split("\n");
// const relevantLines = diffLines.slice(6);

// const diffFiles = parseDiff(relevantLines.join("\n"));
// const diffData = JSON.stringify(diffFiles);
// fs.writeFileSync("diff-serialized-sample-5.json", diffData);
// // console.log(diffFiles);
