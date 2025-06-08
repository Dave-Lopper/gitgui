import { BrowserWindow } from "electron";

import { ActionResponse } from "../../../../commons/action.js";
import { safeGit } from "../../../../commons/safe-git.js";
import { GitRunner } from "../git-runner.js";
import { Branch } from "../../domain/branch.js";
import { dedupRefs } from "../../domain/services.js";

export class GetBranchesForRepository {
  constructor(private readonly gitRunner: GitRunner) {}

  async execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<ActionResponse<Branch[]>> {
    const remote = await safeGit(
      this.gitRunner.getCurrentRemote(repositoryPath),
      window,
    );
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
