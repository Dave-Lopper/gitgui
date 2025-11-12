import { BrowserWindow } from "electron";

import { ElectronEventEmitter } from "../../commons/infra/electron-event-emitter.js";
import { ElectronLocalFilePathSelector } from "../../commons/infra/electron-local-file-selector.js";
import { FsFilesRepository } from "../../commons/infra/fs-file-repository.js";
import { GITENV } from "../../commons/infra/git-env.js";
import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { RepoStatusService } from "../status/application/services/repo-status.js";
import { GitStatusCliRunner } from "../status/infra/git-cli-runner.js";
import { Authenticate } from "./application/use-cases/authenticate.js";
import { CheckoutBranch } from "./application/use-cases/checkout-branch.js";
import { CloneRepository } from "./application/use-cases/clone-repository.js";
import { Fetch } from "./application/use-cases/fetch.js";
import { GetBranchesForRepository } from "./application/use-cases/get-branches.js";
import { GetSavedRepositories } from "./application/use-cases/get-saved-repositories.js";
import { Pull } from "./application/use-cases/pull.js";
import { Push } from "./application/use-cases/push.js";
import { SelectRepositoryFromDisk } from "./application/use-cases/select-repository-from-disk.js";
import { SelectRepositoryFromSaved } from "./application/use-cases/select-repository-from-saved.js";
import { RepositoryGitCliRunner } from "./infra/repo-git-cli-runner.js";
import { SqliteRepositoryStore } from "./infra/sqlite-repository-store.js";

export const bootstrap = async (window: BrowserWindow) => {
  const eventEmitter = new ElectronEventEmitter(window);
  const repoStore = await SqliteRepositoryStore.create();
  const commandRunner = new ShellRunner({ ...process.env, ...GITENV });
  const statusGitRunner = new GitStatusCliRunner(commandRunner);
  const repoStatusService = new RepoStatusService(
    eventEmitter,
    statusGitRunner,
  );
  const localFilePathSelector = new ElectronLocalFilePathSelector(window);
  const repoGitRunner = new RepositoryGitCliRunner(commandRunner);
  const filesRepository = new FsFilesRepository();

  return {
    authenticate: new Authenticate(eventEmitter, repoGitRunner),
    checkoutBranch: new CheckoutBranch(
      eventEmitter,
      repoGitRunner,
      statusGitRunner,
    ),
    cloneRepository: new CloneRepository(
      eventEmitter,
      filesRepository,
      repoGitRunner,
      localFilePathSelector,
      repoStatusService,
      repoStore,
    ),
    getBranchesForRepository: new GetBranchesForRepository(
      eventEmitter,
      repoGitRunner,
    ),
    getSavedRepositories: new GetSavedRepositories(
      eventEmitter,
      repoGitRunner,
      repoStore,
    ),
    fetch: new Fetch(eventEmitter, repoGitRunner, repoStatusService),
    pull: new Pull(eventEmitter, repoGitRunner),
    push: new Push(eventEmitter, repoGitRunner),
    selectRepositoryFromDisk: new SelectRepositoryFromDisk(
      eventEmitter,
      repoGitRunner,
      localFilePathSelector,
      repoStatusService,
      repoStore,
    ),
    selectRepositoryFromSaved: new SelectRepositoryFromSaved(
      eventEmitter,
      repoGitRunner,
      repoStatusService,
    ),
  };
};
