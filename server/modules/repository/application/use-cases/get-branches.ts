import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { ActionResponse } from "../../../../commons/dto/action.js";
import { Branch } from "../../domain/entities.js";
import { dedupRefs } from "../../domain/services.js";
import { RepositoryGitRunner } from "../git-runner.js";

export class GetBranchesForRepository {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: RepositoryGitRunner,
  ) {}

  async execute(repositoryPath: string): Promise<ActionResponse<Branch[]>> {
    const currentBranch = await safeGit(
      this.gitRunner.getCurrentBranch(repositoryPath),
      this.eventEmitter,
    );
    const refs = await safeGit(
      this.gitRunner.listRefs(repositoryPath),
      this.eventEmitter,
    );
    const branches = dedupRefs(currentBranch, refs);

    return {
      success: true,
      action: "getBranchesForRepository",
      data: branches,
    };
  }
}
