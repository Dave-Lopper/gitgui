import path from "path";

import { ActionResponse } from "../../../../commons/action.js";
import { Repository } from "../../domain/repository.js";
import { GitRunner } from "../git-runner.js";
import { RepositoryStore } from "../store.js";

export class GetSavedRepositories {
  constructor(
    private readonly gitRunner: GitRunner,
    private readonly store: RepositoryStore,
  ) {}

  async execute(): Promise<ActionResponse<Repository[]>> {
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
      const branch = await this.gitRunner.getCurrentBranch(repositoryPath);
      const remote = await this.gitRunner.getCurrentRemote(repositoryPath);
      const repository = new Repository({
        localPath: repositoryPath,
        name,
        checkedOutBranch: branch,
        remoteName: remote.name,
        url: remote.url,
      });
      repositories.push(repository);
    }

    return {
      success: true,
      action: "getSavedRepositories",
      data: repositories,
    };
  }
}
