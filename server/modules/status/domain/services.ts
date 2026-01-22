import { StatusEntry, TreeStatus } from "./entities";

type ChangedFileStatus =
  | "REMOVED"
  | "MODIFIED"
  | "UNTRACKED"
  | "MOVED"
  | "ADDED";

export function parseRepoStatus(statusLines: string[]): TreeStatus {
  const treeStatusLine = statusLines[0];
  let unpushed: number = 0;
  let unpulled: number = 0;
  if (!treeStatusLine.includes("...")) {
    unpulled = 0;
    unpushed = 0;
  } else {
    const relevantPart = treeStatusLine.split("...")[1];
    if (relevantPart.includes(" ")) {
      const relevantPartParts = relevantPart.split(" ");
      const commitsPart = relevantPartParts.slice(1).join(" ");
      if (commitsPart.includes(",")) {
        const [ahead, behind] = commitsPart.split(",");
        unpushed = parseInt(ahead.slice(-1));
        unpulled = parseInt(behind.trim().split(" ")[1].slice(0, -1));
      } else if (commitsPart.includes("ahead")) {
        unpushed = parseInt(commitsPart.split("[ahead ")[1].slice(0, -1));
      } else if (commitsPart.includes("behind")) {
        unpulled = parseInt(commitsPart.split("[behind ")[1].slice(0, -1));
      } else {
        throw new Error(`Seemingly malformed status line ${treeStatusLine}`);
      }
    }
  }

  const files: Record<string, StatusEntry> = {};
  for (let i = 0; i < statusLines.length; i++) {
    const line = statusLines[i];
    let staged = false;
    let modType: ChangedFileStatus;
    const indexStatus = line.charAt(0);
    const treeStatus = line.charAt(1);

    if (treeStatus === " ") {
      staged = true;
    }

    if (indexStatus === "A") {
      if (treeStatus !== "D") {
        modType = "ADDED";
      } else {
        // File added in the staging area
        // but removed in the tree, not displaying the diff
        continue;
      }
    } else if (indexStatus === "?" && treeStatus === "?") {
      modType = "UNTRACKED";
    } else if (indexStatus === "D" || treeStatus === "D") {
      modType = "REMOVED";
    } else if (treeStatus === "M" || indexStatus === "M") {
      modType = "MODIFIED";
    } else if (treeStatus === "R" || indexStatus === "R") {
      modType = "MOVED";
    } else if (treeStatus === "C" || indexStatus === "C") {
      modType = "MOVED";
    } else {
      console.warn(`Unexpected staging/tree on status line: ${line}`);
      continue;
    }

    const path = line.slice(3).trim();
    if (path in files) {
      if (modType === "UNTRACKED" && files[path].status === "REMOVED") {
        // Removed in the staging area but re-added in the tree
        files[path].status = "MODIFIED";
      }
    } else {
      files[path] = {
        path,
        status: modType === "UNTRACKED" ? "ADDED" : modType,
        staged,
      };
    }
  }
  return {
    unpulledCommitsCount: unpulled,
    unpushedCommitsCount: unpushed,
    entries: Object.values(files),
  };
}

export function parseCommitStatus(statusLines: string[]): StatusEntry[] {
  console.log({ statusLines });
  const files: StatusEntry[] = [];
  for (let i = 0; i < statusLines.length; i++) {
    const statusLine = statusLines[i];

    const rawFileStatus = statusLine.charAt(0);
    let status: StatusEntry["status"];

    switch (rawFileStatus) {
      case "M":
        status = "MODIFIED";
        break;
      case "A":
        status = "ADDED";
        break;
      case "D":
        status = "REMOVED";
        break;
      case "M":
      case "R":
        status = "MOVED";
        break;
      default:
        console.warn(`Unhandled file status on staus line: ${statusLine}`);
        continue;
    }

    const path = statusLine.slice(2).trim();
    files.push({ status, path, staged: true });
  }
  return files;
}
