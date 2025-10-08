import { BrowserWindow } from "electron";

import { ElectronEventEmitter } from "../../commons/infra/electron-event-emitter.js";
import { FsFilesRepository } from "../../commons/infra/fs-file-repository.js";
import { GITENV } from "../../commons/infra/git-env.js";
import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { GetRepoDiff } from "./application/services/repo-diff.js";
import { AddToGitignore } from "./application/use-cases/add-to-gitignore.js";
import { BatchAddToGitignore } from "./application/use-cases/batch-add-to-gitignore.js";
import { BatchDiscardFileModifications } from "./application/use-cases/batch-discard-file-mofiications.js";
import { ToggleFileStaged } from "./application/use-cases/toggle-files-staged.js";
import { DiffCliGitRunner } from "./infra/diff-git-cli-runner.js";

export function bootstrap(window: BrowserWindow) {
  const eventEmitter = new ElectronEventEmitter(window);
  const filesRepo = new FsFilesRepository();
  const gitRunner = new DiffCliGitRunner(
    new ShellRunner({ ...process.env, ...GITENV }),
  );
  const diffService = new GetRepoDiff(eventEmitter, gitRunner);

  return {
    addToGitignore: new AddToGitignore(filesRepo),
    repoDiff: diffService,
    batchAddToGitignore: new BatchAddToGitignore(filesRepo),
    batchDiscardFileModifications: new BatchDiscardFileModifications(
      eventEmitter,
      filesRepo,
      gitRunner,
    ),
    toggleFileStaged: new ToggleFileStaged(eventEmitter, gitRunner),
  };
}
