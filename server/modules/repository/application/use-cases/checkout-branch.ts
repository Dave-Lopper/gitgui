import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { GitStatusRunner } from "../../../status/application/git-runner.js";
import { parseRepoStatus } from "../../../status/domain/services.js";
import { RepositoryGitRunner } from "../git-runner.js";

export class CheckoutBranch {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: RepositoryGitRunner,
    private readonly statusGitRunner: GitStatusRunner,
  ) {}

  async execute(
    repositoryPath: string,
    branchName: string,
    remoteName?: string,
  ): Promise<boolean> {
    const statusLines =
      await this.statusGitRunner.getRepoStatus(repositoryPath);
    const status = parseRepoStatus(statusLines);

    if (status.entries.length > 0) {
      return false;
    }

    await safeGit(
      this.gitRunner.checkoutBranch(branchName, repositoryPath, remoteName),
      this.eventEmitter,
    );
    return true;
  }
}
