import { BrowserWindow } from "electron";

import { safeGit } from "../../../../commons/application/safe-git.js";
import { parseCommitStatus } from "../../domain/services.js";
import { CommitStatusDto } from "../../dto/commit-status.js";
import { CommitGitRunner } from "../git-runner.js";

export class GetCommitStatus {
  constructor(private readonly gitRunner: CommitGitRunner) {}
  async execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<CommitStatusDto> {
    const commitStatusLines = await safeGit(
      this.gitRunner.getCommitStatus(repositoryPath),
      window,
    );
    return parseCommitStatus(commitStatusLines);
  }
}
