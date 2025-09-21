import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { GetRepoDiff } from "./application/services/repo-diff.js";
import { BatchDiscardFileModifications } from "./application/use-cases/batch-discard-file-mofiications.js";
import { ToggleFileStaged } from "./application/use-cases/toggle-files-staged.js";
import { DiffCliGitRunner } from "./infra/diff-git-cli-runner.js";

export function bootstrap() {
  const gitRunner = new DiffCliGitRunner(new ShellRunner());
  const diffService = new GetRepoDiff(gitRunner);

  return {
    repoDiff: diffService,
    batchDiscardFileModifications: new BatchDiscardFileModifications(gitRunner),
    toggleFileStaged: new ToggleFileStaged(gitRunner),
  };
}
