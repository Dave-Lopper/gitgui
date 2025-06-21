import { SqliteRepositoryStore } from "../../modules/repository/infra/sqlite-repository-store.js";
import { FsFilesRepository } from "../../modules/repository/infra/fs-files-repository.js";
import { GitCliRunner } from "../../modules/repository/infra/git-cli-runner.js";
// import { GitNodeGitRunner } from "../infra/git-nodegit-runner.js";

import { GetBranchesForRepository } from "../../modules/repository/application/use-cases/get-branches-for-repository.js";
import { GetSavedRepositories } from "../../modules/repository/application//use-cases/get-saved-repositories.js";
import { SelectRepositoryFromDisk } from "../../modules/repository/application/use-cases/select-repository-from-disk.js";
import { SelectRepositoryFromSaved } from "../../modules/repository/application/use-cases/select-repository-from-saved.js";
import { CloneRepository } from "../../modules/repository/application/use-cases/clone-repository.js";

import { GetDiff } from "../../modules/file/entrypoints/get-diff.js";

export const bootstrap = async () => {
  const repoStore = await SqliteRepositoryStore.create();
  const gitRunner = new GitCliRunner();
  // const gitRunner = new GitNodeGitRunner();
  const filesRepository = new FsFilesRepository();

  return {
    cloneRepository: new CloneRepository(filesRepository, gitRunner, repoStore),
    getBranchesForRepository: new GetBranchesForRepository(gitRunner),
    getDiff: new GetDiff(gitRunner),
    getSavedRepositories: new GetSavedRepositories(gitRunner, repoStore),
    selectRepositoryFromDisk: new SelectRepositoryFromDisk(
      gitRunner,
      repoStore,
    ),
    selectRepositoryFromSaved: new SelectRepositoryFromSaved(gitRunner),
  };
};
