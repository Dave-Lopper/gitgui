import { SqliteRepositoryStore } from "../infra/sqlite-repository-store.js";
import { FsFilesRepository } from "../infra/fs-files-repository.js";
import { GitCliRunner } from "../infra/git-cli-runner.js";
// import { GitNodeGitRunner } from "../infra/git-nodegit-runner.js";

import { GetBranchesForRepository } from "./use-cases/get-branches-for-repository.js";
import { GetSavedRepositories } from "./use-cases/get-saved-repositories.js";
import { SelectRepositoryFromDisk } from "./use-cases/select-repository-from-disk.js";
import { SelectRepositoryFromSaved } from "./use-cases/select-repository-from-saved.js";
import { CloneRepository } from "./use-cases/clone-repository.js";

export const bootstrap = async () => {
  const repoStore = await SqliteRepositoryStore.create();
  const gitRunner = new GitCliRunner();
  // const gitRunner = new GitNodeGitRunner();
  const filesRepository = new FsFilesRepository();

  return {
    cloneRepository: new CloneRepository(filesRepository, gitRunner, repoStore),
    getBranchesForRepository: new GetBranchesForRepository(gitRunner),
    getSavedRepositories: new GetSavedRepositories(gitRunner, repoStore),
    selectRepositoryFromDisk: new SelectRepositoryFromDisk(
      gitRunner,
      repoStore,
    ),
    selectRepositoryFromSaved: new SelectRepositoryFromSaved(gitRunner),
  };
};
