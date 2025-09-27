import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { CommitUseCase } from "./application/use-cases/commit.js";
import { GetHistory } from "./application/use-cases/get-history.js";
import { CommitGitCliRunner } from "./infra/commit-cli-git-runner.js";

export function bootstrap() {
  const gitRunner = new CommitGitCliRunner(new ShellRunner());
  return {
    commit: new CommitUseCase(gitRunner),
    getHistory: new GetHistory(gitRunner),
  };
}
