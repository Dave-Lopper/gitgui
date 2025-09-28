import path from "path";

import { BrowserWindow } from "electron";

import { safeGit } from "../../../../commons/application/safe-git.js";
import { ActionResponse } from "../../../../commons/dto/action.js";
import { RepoDiffService } from "../../../diff/application/repo-diff-service.js";
import { Repository } from "../../domain/entities.js";
import { dedupRefs } from "../../domain/services.js";
import { RepositorySelectionDto } from "../../dto/repository-selection.js";
import { RepositoryGitRunner } from "../git-runner.js";
import { CommitStatusService } from "../../../commit/application/commit-status-service.js";

export const SelectRepositoryFromSavedStatusValues = [
  "invalidRepo",
  "success",
] as const;
export type SelectRepositoryFromSavedStatus =
  (typeof SelectRepositoryFromSavedStatusValues)[number];

export class SelectRepositoryFromSaved {
  constructor(
    private readonly commitStatusService: CommitStatusService,
    private readonly gitRunner: RepositoryGitRunner,
    private readonly repoDiffService: RepoDiffService,
  ) {}

  async execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<ActionResponse<RepositorySelectionDto>> {
    const isValidRepository =
      await this.gitRunner.isValidRepository(repositoryPath);
    if (!isValidRepository) {
      return {
        action: "selectRepositoryFromSaved",
        success: false,
        status: "invalidRepo",
        message: `invalid repo ${repositoryPath}`,
      };
    }
    const name = path.basename(repositoryPath);
    const branch = await this.gitRunner.getCurrentBranch(repositoryPath);
    const remote = await this.gitRunner.getCurrentRemote(repositoryPath);
    const repository: Repository = {
      localPath: repositoryPath,
      name,
      checkedOutBranch: branch,
      remoteName: remote.name,
      url: remote.url,
    };
    const refs = await safeGit(this.gitRunner.listRefs(repositoryPath), window);
    const branches = dedupRefs(branch, refs);
    const diff = await this.repoDiffService.execute(repositoryPath, window);
    const commitStatus = await this.commitStatusService.execute(
      repositoryPath,
      window,
    );

    return {
      success: true,
      status: "success",
      action: "selectRepositoryFromSaved",
      data: { commitStatus, repository, branches, diff },
    };
  }
}
