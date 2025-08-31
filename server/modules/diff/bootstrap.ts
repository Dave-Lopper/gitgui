import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { GetRepoDiff } from "./application/services/repo-diff.js";
import { DiffCliGitRunner } from "./infra/diff-git-cli-runner.js";

export function bootstrap() {
  const gitRunner = new DiffCliGitRunner(new ShellRunner());
  return { repoDiff: new GetRepoDiff(gitRunner) };
}
