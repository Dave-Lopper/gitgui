import { FsFilesRepository } from "../../commons/infra/fs-file-repository.ts";
import { ShellRunner } from "../../commons/infra/shell-command-runner.ts";
import { GetRepoDiff } from "../diff/application/services/repo-diff.ts";
import { DiffCliGitRunner } from "../diff/infra/diff-git-cli-runner.ts";
import { GetBranchesForRepository } from "./application/use-cases/get-branches.js";
import { GetSavedRepositories } from "./application/use-cases/get-saved-repositories.js";
import { SelectRepositoryFromDisk } from "./application/use-cases/select-repository-from-disk.js";
import { SelectRepositoryFromSaved } from "./application/use-cases/select-repository-from-saved.js";
import { CloneRepository } from "./application/use-cases/clone-repository.js";
import { SqliteRepositoryStore } from "./infra/sqlite-repository-store.js";
import { RepositoryGitCliRunner } from "./infra/repo-git-cli-runner.ts";

export const bootstrap = async () => {
  const repoStore = await SqliteRepositoryStore.create();
  const commandRunner = new ShellRunner();
  const repoGitRunner = new RepositoryGitCliRunner(commandRunner);
  const repoDiffService = new GetRepoDiff(new DiffCliGitRunner(commandRunner));
  const filesRepository = new FsFilesRepository();

  return {
    cloneRepository: new CloneRepository(
      filesRepository,
      repoGitRunner,
      repoDiffService,
      repoStore,
    ),
    getBranchesForRepository: new GetBranchesForRepository(repoGitRunner),
    getSavedRepositories: new GetSavedRepositories(repoGitRunner, repoStore),
    selectRepositoryFromDisk: new SelectRepositoryFromDisk(
      repoGitRunner,
      repoDiffService,
      repoStore,
    ),
    selectRepositoryFromSaved: new SelectRepositoryFromSaved(
      repoGitRunner,
      repoDiffService,
    ),
  };
};
