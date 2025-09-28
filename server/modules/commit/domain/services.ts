import { CommitStatus } from "../dto/commit-status.js";
import { Commit } from "./entities.js";

export function parseHistory(lines: string[]): Commit[] {
  const commits: Commit[] = [];
  for (let i = 0; i < lines.length; i++) {
    const [shortHash, hash, authorName, authorEmail, authoredAt, subject] =
      lines[i].split("|");

    commits.push({
      authoredAt: new Date(authoredAt),
      authorName,
      hash,
      shortHash,
      subject,
      authorEmail: authorEmail ? authorEmail : undefined,
    });
  }

  return commits;
}

export function parseCommitStatus(lines: string[]): CommitStatus {
  const line = lines[0];
  const relevantPart = line.split("...")[1];

  let remoteBranch: string;
  let unpushed = 0;
  let unpulled = 0;
  if (relevantPart.includes(" ")) {
    const relevantPartParts = relevantPart.split(" ");
    remoteBranch = relevantPartParts[0];
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
      throw new Error(`Seemingly malformed status line ${line}`);
    }
  } else {
    remoteBranch = relevantPart;
  }

  const remoteBranchParts = remoteBranch.split("/");
  const remoteName = remoteBranchParts[0];
  const branchName = remoteBranchParts.slice(1).join("/");
  return {
    branchName,
    localUnpushed: unpushed,
    remoteName,
    remoteUnpulled: unpulled,
  };
}
