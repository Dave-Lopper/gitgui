import { GitCliRunner } from "../../../commons/infra/git-cli-runner.js";
import { GitStatusRunner } from "../application/git-runner.js";

export class GitStatusCliRunner
  extends GitCliRunner
  implements GitStatusRunner
{
  async getRepoStatus(repositoryPath: string): Promise<string[]> {
    return await this.safeRun(
      "git",
      ["--no-pager", "status", "-sb", "--porcelain"],
      {
        cwd: repositoryPath,
        trimOutput: false,
      },
    );
  }

  async getCommitStatus(
    repositoryPath: string,
    commitHash: string,
  ): Promise<string[]> {
    return await this.safeRun(
      "git",
      ["--no-pager", "diff", "--name-status", `${commitHash}^!`],
      { cwd: repositoryPath, trimOutput: false },
    );
  }
}
