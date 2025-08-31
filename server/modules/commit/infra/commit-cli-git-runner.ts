import { GitCliRunner } from "../../../commons/infra/git-cli-runner.js";
import { CommitGitRunner } from "../application/git-runner.js";

export class CommitGitCliRunner
  extends GitCliRunner
  implements CommitGitRunner
{
  async getCommitDiff(
    repositoryPath: string,
    commitHash: string,
  ): Promise<string[]> {
    return await this.safeRun(
      "git",
      ["--no-pager", "show", commitHash, "--no-color", "--word-diff=porcelain"],
      { cwd: repositoryPath },
    );
  }

  async getHistory(
    repositoryPath: string,
    page: number,
    pageSize: number,
  ): Promise<string[]> {
    return await this.safeRun(
      "git",
      [
        "--no-pager",
        "log",
        "--no-color",
        `--skip=${pageSize * page}`,
        "-n",
        "--date=iso",
        pageSize.toString(),
        '--pretty=format:"%h|%H|%an|%ae|%ad|%s',
      ],
      {
        cwd: repositoryPath,
      },
    );
  }
}
