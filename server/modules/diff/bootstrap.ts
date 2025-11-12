import { BrowserWindow } from "electron";

import { ElectronEventEmitter } from "../../commons/infra/electron-event-emitter.js";
import { FsFilesRepository } from "../../commons/infra/fs-file-repository.js";
import { GITENV } from "../../commons/infra/git-env.js";
import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { RepoStatusService } from "../status/application/services/repo-status.js";
import { GitStatusCliRunner } from "../status/infra/git-cli-runner.js";
import { AddToGitignore } from "./application/use-cases/add-to-gitignore.js";
import { BatchAddToGitignore } from "./application/use-cases/batch-add-to-gitignore.js";
import { BatchDiscardFileModifications } from "./application/use-cases/batch-discard-file-mofiications.js";
import { GetTreeFileDiff } from "./application/use-cases/get-tree-file-diff.js";
import { StageAndStash } from "./application/use-cases/stage-and-stash.js";
import { ToggleFileStaged } from "./application/use-cases/toggle-files-staged.js";
import { DiffCliGitRunner } from "./infra/diff-git-cli-runner.js";

export function bootstrap(window: BrowserWindow) {
  const shellRunner = new ShellRunner({ ...process.env, ...GITENV });
  const eventEmitter = new ElectronEventEmitter(window);
  const repoStatusService = new RepoStatusService(
    eventEmitter,
    new GitStatusCliRunner(shellRunner),
  );
  const filesRepo = new FsFilesRepository();
  const gitRunner = new DiffCliGitRunner(shellRunner);

  return {
    addToGitignore: new AddToGitignore(filesRepo),
    batchAddToGitignore: new BatchAddToGitignore(filesRepo),
    batchDiscardFileModifications: new BatchDiscardFileModifications(
      eventEmitter,
      filesRepo,
      gitRunner,
      repoStatusService,
    ),
    getTreeFileDiff: new GetTreeFileDiff(eventEmitter, gitRunner),
    stageAndStash: new StageAndStash(eventEmitter, gitRunner),
    toggleFileStaged: new ToggleFileStaged(eventEmitter, gitRunner),
  };
}
