import { GitCliRunner } from "../../../commons/infra/git-cli-runner.js";
import { DiffGitRunner } from "../application/git-runner.js";

export class DiffCliGitRunner extends GitCliRunner implements DiffGitRunner {
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

  async getRepoDiff(
    repositoryPath: string,
    staged: boolean,
  ): Promise<string[]> {
    const args = ["diff", "--no-color", "--word-diff=porcelain"];
    if (staged) {
      args.push("--cached");
    }
    const lines = await this.safeRun("git", args, {
      trimOutput: false,
      cwd: repositoryPath,
    });
    return lines;
  }

  async getStagedFileByName(
    repositoryPath: string,
    filePath: string,
  ): Promise<string[]> {
    const lines = await this.safeRun(
      "git",
      ["--no-pager", "diff", "--cached", "--name-only", "--", filePath],
      { trimOutput: false, cwd: repositoryPath },
    );
    return lines;
  }

  async stageFile(repositoryPath: string, filePath: string): Promise<void> {
    await this.safeRun("git", ["add", filePath], {
      cwd: repositoryPath,
    });
  }

  async unstageFile(repositoryPath: string, filePath: string): Promise<void> {
    await this.safeRun("git", ["restore", "--cached", filePath], {
      cwd: repositoryPath,
    });
  }
}
