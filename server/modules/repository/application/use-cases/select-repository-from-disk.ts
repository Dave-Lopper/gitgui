import path from "path";

import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { ILocalFilePathSelector } from "../../../../commons/application/i-file-selector.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { ActionResponse } from "../../../../commons/dto/action.js";
import { RepoStatusService } from "../../../status/application/services/repo-status.js";
import { Repository } from "../../domain/entities.js";
import { dedupRefs } from "../../domain/services.js";
import { RepositorySelectionDto } from "../../dto/repository-selection.js";
import { RepositoryGitRunner } from "../git-runner.js";
import { RepositoryStore } from "../store.js";

export type SelectRepositoryFromDiskStatus =
  | "canceled"
  | "invalidRepo"
  | "success";

export class SelectRepositoryFromDisk {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: RepositoryGitRunner,
    private readonly localFilePathSelector: ILocalFilePathSelector,
    private readonly repoStatusService: RepoStatusService,
    private readonly store: RepositoryStore,
  ) {}

  async execute(): Promise<ActionResponse<RepositorySelectionDto>> {
    const result = await this.localFilePathSelector.selectPath();
    if (result.status === "CANCELED") {
      return {
        status: "canceled",
        action: "selectRepositoryFromDisk",
        success: false,
        message: "Action canceled by user",
      };
    }

    const repositoryPath = result.paths[0];
    const isRepoValid = await this.gitRunner.isValidRepository(repositoryPath);
    if (!isRepoValid) {
      return {
        status: "invalidRepo",
        success: false,
        action: "selectRepositoryFromDisk",
      };
    }

    const repositoryName = path.basename(repositoryPath);
    const branchName = await safeGit(
      this.gitRunner.getCurrentBranch(repositoryPath),
      this.eventEmitter,
    );
    const remote = await safeGit(
      this.gitRunner.getCurrentRemote(repositoryPath),
      this.eventEmitter,
    );
    const repository: Repository = {
      checkedOutBranch: branchName,
      localPath: repositoryPath,
      name: repositoryName,
      remoteName: remote.name,
      url: remote.url,
    };
    const refs = await safeGit(
      this.gitRunner.listRefs(repositoryPath),
      this.eventEmitter,
    );
    const branches = dedupRefs(branchName, refs);
    const treeStatus = await this.repoStatusService.execute(repositoryPath);

    void (async () => {
      try {
        await safeGit(this.gitRunner.fetch(repositoryPath), this.eventEmitter);
        const treeStatus = await this.repoStatusService.execute(repositoryPath);
        this.eventEmitter.send("repository:fetched", treeStatus);
      } catch (err) {
        console.error(`Error while fetching and getting commit status: ${err}`);
      }
    })();

    const repositoryExists = await this.store.exists(repository);
    if (!repositoryExists) {
      await this.store.save(repository);
    }

    return {
      action: "selectRepositoryFromDisk",
      status: "success",
      success: true,
      data: { repository, branches, treeStatus },
    };
  }
}
