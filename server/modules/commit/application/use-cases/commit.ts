import { BrowserWindow } from "electron";

import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffFile } from "../../../diff/domain/entities.js";
import { parseDiff } from "../../../diff/domain/services.js";
import { Commit } from "../../domain/entities.js";
import { parseHistory } from "../../domain/services.js";
import { CommitGitRunner } from "../git-runner.js";

export class CommitUseCase {
  constructor(private readonly gitRunner: CommitGitRunner) {}

  async execute(
    repositoryPath: string,
    message: string,
    window: BrowserWindow,
    description?: string,
  ): Promise<Commit & { diff: DiffFile[] }> {
    const finalizedMessage = description
      ? `${message}\n\n${description}`
      : message;

    await safeGit(
      this.gitRunner.commit(repositoryPath, finalizedMessage),
      window,
    );

    const commitHashes = await safeGit(
      this.gitRunner.getHeadHashes(repositoryPath),
      window,
    );
    const commitDiffLines = await safeGit(
      this.gitRunner.getCommitDiff(repositoryPath, commitHashes.hash),
      window,
    );
    const commitDiff = parseDiff(commitDiffLines);
    const historyLines = await safeGit(
      this.gitRunner.getHistory(repositoryPath, 1, 1),
      window,
    );
    const commit = parseHistory(historyLines)[0];

    return { ...commit, diff: commitDiff };
  }
}
