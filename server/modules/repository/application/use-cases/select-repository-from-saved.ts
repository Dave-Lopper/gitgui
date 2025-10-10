import path from "path";

import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { ActionResponse } from "../../../../commons/dto/action.js";
import { CommitStatusService } from "../../../commit/application/commit-status-service.js";
import { RepoDiffService } from "../../../diff/application/repo-diff-service.js";
import { Repository } from "../../domain/entities.js";
import { dedupRefs } from "../../domain/services.js";
import { RepositorySelectionDto } from "../../dto/repository-selection.js";
import { RepositoryGitRunner } from "../git-runner.js";

export const SelectRepositoryFromSavedStatusValues = [
  "invalidRepo",
  "success",
] as const;
export type SelectRepositoryFromSavedStatus =
  (typeof SelectRepositoryFromSavedStatusValues)[number];

export class SelectRepositoryFromSaved {
  constructor(
    private readonly commitStatusService: CommitStatusService,
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: RepositoryGitRunner,
    private readonly repoDiffService: RepoDiffService,
  ) {}

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
    const repository: Repository = {
      localPath: repositoryPath,
      name,
      checkedOutBranch: branch,
      remoteName: remote.name,
      url: remote.url,
    };
    const refs = await safeGit(
      this.gitRunner.listRefs(repositoryPath),
      this.eventEmitter,
    );
    const branches = dedupRefs(branch, refs);
    const diff = await this.repoDiffService.execute(repositoryPath);

    void (async () => {
      try {
        await safeGit(this.gitRunner.fetch(repositoryPath), this.eventEmitter);
        const commitStatus = await this.commitStatusService.execute(
          repositoryPath,
          this.eventEmitter,
        );
        this.eventEmitter.send("repository:fetched", commitStatus);
      } catch (err) {
        console.error(`Error while fetching and getting commit status: ${err}`);
        throw err;
      }
    })();

    return {
      success: true,
      status: "success",
      action: "selectRepositoryFromSaved",
      data: { repository, branches, diff },
    };
  }
}
