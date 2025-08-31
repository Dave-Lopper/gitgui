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
