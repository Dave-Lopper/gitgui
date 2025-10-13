import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepoDiffService } from "../../../diff/application/repo-diff-service.js";
import { RepositoryGitRunner } from "../git-runner.js";

export class CheckoutBranch {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: RepositoryGitRunner,
    private readonly repoDiffService: RepoDiffService,
  ) {}

  async execute(
    repositoryPath: string,
    branchName: string,
    remoteName?: string,
  ): Promise<boolean> {
    const diff = await this.repoDiffService.execute(repositoryPath);
    if (diff.length > 0) {
      return false;
    }

    await safeGit(
      this.gitRunner.checkoutBranch(branchName, repositoryPath, remoteName),
      this.eventEmitter,
    );
    return true;
  }
}
