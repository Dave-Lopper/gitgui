import path from "path";

import { ActionResponse } from "../../../../commons/action.js";
import { Repository } from "../../domain/repository.js";
import { RepositorySelectionDto } from "../../dto/repository-selection.js";
import { GitRunner } from "../git-runner.js";
import { dedupRefs } from "../../domain/services.js";

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
    const refs = await this.gitRunner.listRefs(repositoryPath);
    const branches = dedupRefs(branch, refs);

    return {
      success: true,
      status: "success",
      action: "selectRepositoryFromSaved",
      data: { repository, branches },
    };
  }
}
