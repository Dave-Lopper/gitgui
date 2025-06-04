import { ActionResponse } from "../../../../commons/action.js";
import { safeGit } from "../../../../commons/safe-git.js";
import { GitRunner } from "../git-runner.js";
import { Branch } from "../../domain/branch.js";
import { BrowserWindow } from "electron";

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
    const branches = await safeGit(
      this.gitRunner.listBranches(repositoryPath, remote.name),
      window,
    );

    return {
      success: true,
      action: "getBranchesForRepository",
      data: branches.map((branch) => ({
        name: branch,
        isCurrent: branch === currentBranch,
      })),
    };
  }
}
