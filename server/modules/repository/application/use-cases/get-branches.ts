import { BrowserWindow } from "electron";

import { ActionResponse } from "../../../../commons/dto/action.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepositoryGitRunner } from "../git-runner.js";
import { Branch } from "../../domain/entities.js";
import { dedupRefs } from "../../domain/services.js";

export class GetBranchesForRepository {
  constructor(private readonly gitRunner: RepositoryGitRunner) {}

  async execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<ActionResponse<Branch[]>> {
    const currentBranch = await safeGit(
      this.gitRunner.getCurrentBranch(repositoryPath),
      window,
    );
    const refs = await safeGit(this.gitRunner.listRefs(repositoryPath), window);
    const branches = dedupRefs(currentBranch, refs);

    return {
      success: true,
      action: "getBranchesForRepository",
      data: branches,
    };
  }
}
