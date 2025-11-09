import { default as pathModule } from "path";

import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { ILocalFilePathSelector } from "../../../../commons/application/i-file-selector.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { ActionResponse } from "../../../../commons/dto/action.js";
import { RepoStatusService } from "../../../status/application/services/repo-status.js";
import { Repository } from "../../domain/entities.js";
import {
  dedupRefs,
  getRepositoryNameFromRemoteUrl,
} from "../../domain/services.js";
import { RepositorySelectionDto } from "../../dto/repository-selection.js";
import { RepositoryGitRunner } from "../git-runner.js";
import { RepositoryStore } from "../store.js";

export class CloneRepository {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly filesRepository: FilesRepository,
    private readonly gitRunner: RepositoryGitRunner,
    private readonly localFilePathSelector: ILocalFilePathSelector,
    private readonly repoStatusService: RepoStatusService,
    private readonly store: RepositoryStore,
  ) {}

  async execute(url: string): Promise<ActionResponse<RepositorySelectionDto>> {
    const result = await this.localFilePathSelector.selectPath();
    if (result.status === "CANCELED") {
      return {
        status: "canceled",
        action: "cloneRepository",
        success: false,
        message: "Action canceled by user",
      };
    }

    const path = result.paths[0];
    const tmpFolder = await safeGit(
      this.gitRunner.cloneRepository(url, path),
      this.eventEmitter,
    );

    const remote = await safeGit(
      this.gitRunner.getCurrentRemote(tmpFolder),
      this.eventEmitter,
    );
    const repoName = getRepositoryNameFromRemoteUrl(remote.url);
    if (!repoName) {
      await this.filesRepository.deleteFolder(tmpFolder);
      throw new Error("Could not determine the name of repository");
    }

    const currentBranch = await safeGit(
      this.gitRunner.getCurrentBranch(tmpFolder),
      this.eventEmitter,
    );

    const repositoryPath = pathModule.join(path, repoName);
    await this.filesRepository.copyFolder(tmpFolder, repositoryPath);
    await this.filesRepository.deleteFolder(tmpFolder);

    const refs = await this.gitRunner.listRefs(repositoryPath);
    const branches = dedupRefs(currentBranch, refs);

    const repository: Repository = {
      name: repoName,
      localPath: repositoryPath,
      remoteName: remote.name,
      url: remote.url,
      checkedOutBranch: currentBranch,
    };

    const reopositoryExists = await this.store.exists(repository);
    if (!reopositoryExists) {
      await this.store.save(repository);
    }
    const treeStatus = await this.repoStatusService.execute(repositoryPath);

    return {
      action: "cloneRepository",
      success: true,
      data: { repository, branches, treeStatus },
    };
  }
}
