import { GitCliRunner } from "../../../commons/infra/git-cli-runner.js";
import { DiffGitRunner } from "../application/git-runner.js";

export class DiffCliGitRunner extends GitCliRunner implements DiffGitRunner {
  async discardFileChanges(
    repositoryPath: string,
    filePath: string,
  ): Promise<void> {
    await this.safeRun(
      "git",
      ["--no-pager", "restore", "--staged", "--worktree", "--", filePath],
      { cwd: repositoryPath },
    );
  }

  async getAddedFileDiff(
    repositoryPath: string,
    filePath: string,
  ): Promise<string[]> {
    return await this.safeRun(
      "git",
      [
        "--no-pager",
        "diff",
        "--no-index",
        "--word-diff=porcelain",
        "--no-color",
        "/dev/null",
        filePath,
      ],
      { cwd: repositoryPath },
      true,
      [0, 1],
    );
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

  async getFileNumStats(
    repositoryPath: string,
    filePath: string,
    staged: boolean,
  ): Promise<string> {
    const args = ["--no-pager", "diff", "--no-color", "--numstat"];
    if (staged) {
      args.push("--cached");
    }
    args.push(filePath);
    const result = await this.safeRun(
      "git",
      args,
      { cwd: repositoryPath, trimOutput: false },
      false,
    );
    return result;
  }

  async getFileDiff(
    repositoryPath: string,
    filePath: string,
    staged: boolean,
  ): Promise<string> {
    const args = ["--no-pager", "diff", "--no-color", "--word-diff=porcelain"];
    if (staged) {
      args.push("--cached");
    }
    args.push(filePath);
    return await this.safeRun(
      "git",
      args,
      { cwd: repositoryPath, trimOutput: false },
      false,
    );
  }

  async getHeadFileContents(
    branchName: string,
    remoteName: string,
    repositoryPath: string,
    filePath: string,
  ): Promise<string> {
    return await this.safeRun(
      "git",
      ["--no-pager", "show", `${remoteName}/${branchName}:${filePath}`],
      { cwd: repositoryPath, trimOutput: false },
      false,
    );
  }

  async getHeadFileLinecount(
    repositoryPath: string,
    filePath: string,
  ): Promise<string> {
    const result = await this.cmdRunner.pipe(
      {
        cmd: "git",
        args: ["show", `HEAD:${filePath}`],
        options: { cwd: repositoryPath, splitLines: false },
      },
      {
        cmd: "wc",
        args: ["-l"],
        options: { cwd: repositoryPath, splitLines: false },
      },
    );
    return result.stdout as string;
  }

  async getRepoDiff(repositoryPath: string, staged: boolean): Promise<string> {
    const args = ["diff", "--no-color", "--word-diff=porcelain"];
    if (staged) {
      args.push("--cached");
    }
    return await this.safeRun(
      "git",
      args,
      {
        trimOutput: false,
        cwd: repositoryPath,
      },
      false,
    );
  }

  async getRepoStatus(repositoryPath: string): Promise<string[]> {
    return await this.safeRun("git", ["--no-pager", "status", "--porcelain"], {
      cwd: repositoryPath,
      trimOutput: false,
    });
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

  async stageFiles(repositoryPath: string): Promise<void> {
    await this.safeRun("git", ["add", "."], {
      cwd: repositoryPath,
    });
  }

  async stashFiles(repositoryPath: string): Promise<void> {
    await this.safeRun("git", ["stash"], { cwd: repositoryPath });
  }

  async unstageFile(repositoryPath: string, filePath: string): Promise<void> {
    await this.safeRun("git", ["restore", "--staged", filePath], {
      cwd: repositoryPath,
    });
  }
}
