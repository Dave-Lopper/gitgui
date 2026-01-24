import { GitCliRunner } from "../../../commons/infra/git-cli-runner.js";
import { CommitGitRunner } from "../application/git-runner.js";
import { HeadHashesDto } from "../dto/head-hashes.js";

export class CommitGitCliRunner
  extends GitCliRunner
  implements CommitGitRunner
{
  async commit(repositoryPath: string, message: string): Promise<void> {
    await this.safeRun("git", ["commit", "-m", `"${message}"`], {
      cwd: repositoryPath,
    });
  }

  async getHeadHashes(repositoryPath: string): Promise<HeadHashesDto> {
    const longHash = await this.safeRun("git", ["rev-parse", "HEAD"], {
      cwd: repositoryPath,
    });
    const shortHash = await this.safeRun(
      "git",
      ["rev-parse", "--short", "HEAD"],
      { cwd: repositoryPath },
    );
    return { hash: longHash[0], shortHash: shortHash[0] };
  }

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

  async getCommitFileStats(
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ): Promise<string[]> {
    return await this.safeRun(
      "git",
      ["--no-pager", "show", "--numstat", commitHash, "--", filePath],
      { cwd: repositoryPath },
    );
  }

  async getCommitFileDiff(
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ): Promise<string> {
    return await this.safeRun(
      "git",
      [
        "--no-pager",
        "show",
        commitHash,
        "--no-color",
        "--word-diff=porcelain",
        "--",
        filePath,
      ],
      { cwd: repositoryPath },
      false,
    );
  }

  async getCommitfilePatch(
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ): Promise<string> {
    return await this.safeRun(
      "git",
      [
        "--no-pager",
        "show",
        "-m",
        "--no-color",
        "--patch-with-raw",
        commitHash,
        "--",
        filePath,
      ],
      { cwd: repositoryPath },
      false,
    );
  }

  async getCommitFiles(
    repositoryPath: string,
    commitHash: string,
  ): Promise<string[]> {
    return await this.safeRun(
      "git",
      ["--no-pager", "show", "--no-color", "--name-status", "-m", commitHash],
      { cwd: repositoryPath },
    );
  }

  async getTreeStatus(repositoryPath: string): Promise<string[]> {
    return await this.safeRun(
      "git",
      ["--no-pager", "status", "-sb", "--porcelain"],
      { cwd: repositoryPath },
    );
  }

  async getCommitsCount(repositoryPath: string): Promise<string[]> {
    return await this.safeRun("git", ["rev-list", "--count", "HEAD"], {
      cwd: repositoryPath,
    });
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
        `--skip=${pageSize * (page - 1)}`,
        "-n",
        pageSize.toString(),
        "--date=iso",
        '--pretty=format:"%h|%H|%an|%ae|%ad|%s',
      ],
      {
        cwd: repositoryPath,
      },
    );
  }
}
