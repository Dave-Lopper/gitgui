import { ElectronEventEmitter } from "../../commons/infra/event-emitter.js";
import { FsFilesRepository } from "../../commons/infra/fs-file-repository.js";
import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { GetRepoDiff } from "../diff/application/services/repo-diff.js";
import { DiffCliGitRunner } from "../diff/infra/diff-git-cli-runner.js";
import { Fetch } from "./application/use-cases/fetch.js";
import { GetBranchesForRepository } from "./application/use-cases/get-branches.js";
import { GetSavedRepositories } from "./application/use-cases/get-saved-repositories.js";
import { Pull } from "./application/use-cases/pull.js";
import { SelectRepositoryFromDisk } from "./application/use-cases/select-repository-from-disk.js";
import { SelectRepositoryFromSaved } from "./application/use-cases/select-repository-from-saved.js";
import { CloneRepository } from "./application/use-cases/clone-repository.js";
import { SqliteRepositoryStore } from "./infra/sqlite-repository-store.js";
import { RepositoryGitCliRunner } from "./infra/repo-git-cli-runner.js";
import { GetCommitStatus } from "../commit/application/services/get-commit-status.js";
import { CommitGitCliRunner } from "../commit/infra/commit-cli-git-runner.js";
import { BrowserWindow } from "electron";

export const bootstrap = async (window: BrowserWindow) => {
  const eventEmitter = new ElectronEventEmitter(window);
  const repoStore = await SqliteRepositoryStore.create();
  const commandRunner = new ShellRunner();
  const commitStatusService = new GetCommitStatus(
    new CommitGitCliRunner(commandRunner),
  );
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
    fetch: new Fetch(repoGitRunner),
    pull: new Pull(repoGitRunner),
    selectRepositoryFromDisk: new SelectRepositoryFromDisk(
      commitStatusService,
      eventEmitter,
      repoGitRunner,
      repoDiffService,
      repoStore,
    ),
    selectRepositoryFromSaved: new SelectRepositoryFromSaved(
      commitStatusService,
      eventEmitter,
      repoGitRunner,
      repoDiffService,
    ),
  };
};
