import { BrowserWindow } from "electron";

import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepositoryGitRunner } from "../git-runner.js";
import { CommitStatusService } from "../../../commit/application/commit-status-service.js";
import { CommitStatusDto } from "../../../commit/dto/commit-status.js";

export class Fetch {
  constructor(
    private readonly commitStatusService: CommitStatusService,
    private readonly gitRunner: RepositoryGitRunner,
  ) {}

  async execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<CommitStatusDto> {
    await safeGit(this.gitRunner.fetch(repositoryPath), window);
    const dto = await this.commitStatusService.execute(repositoryPath, window);
    return dto;
  }
}
