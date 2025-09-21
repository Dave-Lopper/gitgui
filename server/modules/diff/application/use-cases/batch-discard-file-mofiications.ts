import { BrowserWindow } from "electron";

import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffCliGitRunner } from "../../infra/diff-git-cli-runner.js";

export class BatchDiscardFileModifications {
  constructor(private readonly gitRunner: DiffCliGitRunner) {}

  async execute(
    repositoryPath: string,
    filePaths: string[],
    window: BrowserWindow,
  ): Promise<void> {
    filePaths.forEach(async (filePath) => {
      await safeGit(
        this.gitRunner.discardFileChanges(repositoryPath, filePath),
        window,
      );
    });
  }
}
