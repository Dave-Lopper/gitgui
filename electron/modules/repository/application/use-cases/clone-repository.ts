import os from "os";
import { default as pathModule } from "path";

import { BrowserWindow, dialog } from "electron";

import { GitRunner } from "../git-runner.js";
import { RepositoryStore } from "../store.js";
import { Repository } from "../../domain/repository.js";
import { RepositorySelectionDto } from "../../dto/repository-selection.js";
import { parseDiff } from "../../../file/domain.js";
import { ActionResponse } from "../../../../commons/action.js";
import { safeGit } from "../../../../commons/safe-git.js";

import {
  dedupRefs,
  getRepositoryNameFromRemoteUrl,
} from "../../domain/services.js";
import { FilesRepository } from "../files-repository.js";
import { GetDiff } from "../../../file/entrypoints/get-diff.js";

export class CloneRepository {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly gitRunner: GitRunner,
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

    const repository = new Repository({
      name: repoName,
      localPath: repositoryPath,
      remoteName: remote.name,
      url: remote.url,
      checkedOutBranch: currentBranch,
    });

    const reopositoryExists = await this.store.exists(repository);
    if (!reopositoryExists) {
      await this.store.save(repository);
    }
    const diffService = new GetDiff(this.gitRunner);
    const diff = await diffService.execute(repositoryPath, window);

    return {
      action: "cloneRepository",
      success: true,
      data: { repository, branches, diff },
    };
  }
}
