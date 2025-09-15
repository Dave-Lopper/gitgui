import path from "path";

import { BrowserWindow } from "electron";

import { ActionResponse } from "../../../../commons/dto/action.js";
import { Repository } from "../../domain/entities.js";
import { RepositoryGitRunner } from "../git-runner.js";
import { RepositoryStore } from "../store.js";
import { safeGit } from "../../../../commons/application/safe-git.js";

export class GetSavedRepositories {
  constructor(
    private readonly gitRunner: RepositoryGitRunner,
    private readonly store: RepositoryStore,
  ) {}

  async execute(window: BrowserWindow): Promise<ActionResponse<Repository[]>> {
    const repositoryPaths = await this.store.getSavedRepositories();
    const repositories: Repository[] = [];

    for (let i = 0; i < repositoryPaths.length; i++) {
      const repositoryPath = repositoryPaths[i];
      const isValidRepository =
        await this.gitRunner.isValidRepository(repositoryPath);
      if (!isValidRepository) {
        console.warn(
          `Invalid reposiotry in local persistence: ${repositoryPath}`,
        );
        continue;
      }
      const name = path.basename(repositoryPath);
      const branch = await safeGit(
        this.gitRunner.getCurrentBranch(repositoryPath),
        window,
      );
      const remote = await safeGit(
        this.gitRunner.getCurrentRemote(repositoryPath),
        window,
      );
      const repository: Repository = {
        localPath: repositoryPath,
        name,
        checkedOutBranch: branch,
        remoteName: remote.name,
        url: remote.url,
      };
      repositories.push(repository);
    }

    return {
      success: true,
      action: "getSavedRepositories",
      data: repositories,
    };
  }
}
