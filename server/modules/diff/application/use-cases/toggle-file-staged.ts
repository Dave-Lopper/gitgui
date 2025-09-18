import { BrowserWindow } from "electron";

import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffCliGitRunner } from "../../infra/diff-git-cli-runner.js";

export class ToggleFileStaged {
  constructor(private readonly gitRunner: DiffCliGitRunner) {}

  async execute(
    repositoryPath: string,
    filePath: string,
    window: BrowserWindow,
  ): Promise<void> {
    const isStaged =
      (
        await safeGit(
          this.gitRunner.getStagedFileByName(repositoryPath, filePath),
          window,
        )
      ).length > 0;

    if (isStaged) {
      await safeGit(
        this.gitRunner.unstageFile(repositoryPath, filePath),
        window,
      );
    } else {
      await safeGit(this.gitRunner.stageFile(repositoryPath, filePath), window);
    }
  }
}
