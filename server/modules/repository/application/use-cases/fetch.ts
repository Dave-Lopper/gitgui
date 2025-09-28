import { BrowserWindow } from "electron";

import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepositoryGitRunner } from "../git-runner.js";

export class Fetch {
  constructor(private readonly gitRunner: RepositoryGitRunner) {}

  async execute(repositoryPath: string, window: BrowserWindow): Promise<void> {
    await safeGit(this.gitRunner.fetch(repositoryPath), window);
  }
}
