import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { GetRepoDiff } from "./application/services/repo-diff.js";
import { RefreshRepoDiff } from "./application/use-cases/refresh-diff.js";
import { ToggleFileStaged } from "./application/use-cases/toggle-file-staged.js";
import { DiffCliGitRunner } from "./infra/diff-git-cli-runner.js";

export function bootstrap() {
  const gitRunner = new DiffCliGitRunner(new ShellRunner());
  const diffService = new GetRepoDiff(gitRunner);

  return {
    refreshRepoDiff: new RefreshRepoDiff(diffService),
    repoDiff: diffService,
    toggleFileStaged: new ToggleFileStaged(gitRunner),
  };
}
