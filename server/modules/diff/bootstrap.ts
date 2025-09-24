import { FsFilesRepository } from "../../commons/infra/fs-file-repository.js";
import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { GetRepoDiff } from "./application/services/repo-diff.js";
import { AddToGitignore } from "./application/use-cases/add-to-gitignore.js";
import { BatchAddToGitignore } from "./application/use-cases/batch-add-to-gitignore.js";
import { BatchDiscardFileModifications } from "./application/use-cases/batch-discard-file-mofiications.js";
import { ToggleFileStaged } from "./application/use-cases/toggle-files-staged.js";
import { DiffCliGitRunner } from "./infra/diff-git-cli-runner.js";

export function bootstrap() {
  const filesRepo = new FsFilesRepository();
  const gitRunner = new DiffCliGitRunner(new ShellRunner());
  const diffService = new GetRepoDiff(gitRunner);

  return {
    addToGitignore: new AddToGitignore(filesRepo),
    repoDiff: diffService,
    batchAddToGitignore: new BatchAddToGitignore(filesRepo),
    batchDiscardFileModifications: new BatchDiscardFileModifications(
      filesRepo,
      gitRunner,
    ),
    toggleFileStaged: new ToggleFileStaged(gitRunner),
  };
}
