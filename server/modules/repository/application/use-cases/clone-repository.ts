import os from "os";
import { default as pathModule } from "path";

import { BrowserWindow, dialog } from "electron";

import { RepositoryGitRunner } from "../git-runner.js";
import { RepositoryStore } from "../store.js";
import { Repository } from "../../domain/entities.js";
import { RepositorySelectionDto } from "../../dto/repository-selection.js";
import { ActionResponse } from "../../../../commons/dto/action.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import {
  dedupRefs,
  getRepositoryNameFromRemoteUrl,
} from "../../domain/services.js";
import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { RepoDiffService } from "../../../diff/application/repo-diff-service.js";

export class CloneRepository {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly gitRunner: RepositoryGitRunner,
    private readonly repoDiffService: RepoDiffService,
    private readonly store: RepositoryStore,
  ) {}

  async execute(
    url: string,
    window: BrowserWindow,
  ): Promise<ActionResponse<RepositorySelectionDto>> {
    const result: any = await dialog.showOpenDialog(window, {
      properties: ["openDirectory"],
      defaultPath: os.homedir(),
    });
    if (result.canceled) {
      return {
        status: "canceled",
        action: "cloneRepository",
        success: false,
        message: "Action canceled by user",
      };
    }

    const path = result.filePaths[0];
    const tmpFolder = await safeGit(
      this.gitRunner.cloneRepository(url, path),
      window,
    );

    const remote = await safeGit(
      this.gitRunner.getCurrentRemote(tmpFolder),
      window,
    );
    const repoName = getRepositoryNameFromRemoteUrl(remote.url);
    if (!repoName) {
      await this.filesRepository.deleteFolder(tmpFolder);
      throw new Error("Could not determine the name of repository");
    }

    const currentBranch = await safeGit(
      this.gitRunner.getCurrentBranch(tmpFolder),
      window,
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
    const diff = await this.repoDiffService.execute(repositoryPath, window);
    const commitStatus = {
      branchName: currentBranch,
      remoteName: remote.name,
      remoteUnpulled: 0,
      localUnpushed: 0,
    };

    return {
      action: "cloneRepository",
      success: true,
      data: { commitStatus, repository, branches, diff },
    };
  }
}
