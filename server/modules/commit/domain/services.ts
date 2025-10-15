import { CommitStatusDto } from "../dto/commit-status.js";
import { Commit } from "./entities.js";

export function parseHistory(lines: string[]): Commit[] {
  const commits: Commit[] = [];
  for (let i = 0; i < lines.length; i++) {
    const [shortHash, hash, authorName, authorEmail, authoredAt, subject] =
      lines[i].slice(1).split("|");

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

export function parseCommitStatus(lines: string[]): CommitStatusDto {
  const line = lines[0];

  if (!line.includes("...")) {
    return {
      localUnpushed: 0,
      remoteUnpulled: 0,
    };
  }
  const relevantPart = line.split("...")[1];

  let unpushed = 0;
  let unpulled = 0;
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
      throw new Error(`Seemingly malformed status line ${line}`);
    }
  }

  return {
    localUnpushed: unpushed,
    remoteUnpulled: unpulled,
  };
}
