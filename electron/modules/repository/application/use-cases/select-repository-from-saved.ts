import path from "path";

import { BrowserWindow } from "electron";

import { ActionResponse } from "../../../../commons/action.js";
import { Repository } from "../../domain/repository.js";
import { RepositorySelectionDto } from "../../dto/repository-selection.js";
import { GitRunner } from "../git-runner.js";
import { dedupRefs } from "../../domain/services.js";
import { safeGit } from "../../../../commons/safe-git.js";
import { GetDiff } from "../../../file/entrypoints/get-diff.js";

export const SelectRepositoryFromSavedStatusValues = [
  "invalidRepo",
  "success",
] as const;
export type SelectRepositoryFromSavedStatus =
  (typeof SelectRepositoryFromSavedStatusValues)[number];

export class SelectRepositoryFromSaved {
  constructor(private readonly gitRunner: GitRunner) {}

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
    const repository = new Repository({
      localPath: repositoryPath,
      name,
      checkedOutBranch: branch,
      remoteName: remote.name,
      url: remote.url,
    });
    const refs = await safeGit(this.gitRunner.listRefs(repositoryPath), window);
    const branches = dedupRefs(branch, refs);
    const diffService = new GetDiff(this.gitRunner);
    const diff = await diffService.execute(repositoryPath, window);

    return {
      success: true,
      status: "success",
      action: "selectRepositoryFromSaved",
      data: { repository, branches, diff },
    };
  }
}
