import { v4 as uuidv4 } from "uuid";

import {
  CommandOptions,
  CommandRunner,
} from "../../../commons/application/command-runner.js";
import { GitRunner } from "../application/git-runner.js";
import { Branch } from "../domain/branch.js";
import { GitError } from "../domain/git-error.js";
import { RepositoryReferences } from "../dto/reference.js";
import { Remote } from "../dto/remote.js";
import { ChangedFile, ModType, parseDiff } from "../../file/domain.js";
import { ShellRunner } from "../../../commons/infra/shell-runner.js";

const validGitActions = ["M", "T", "A", "D", "R", "C", "U", "??"] as const;
type GitFileAction = (typeof validGitActions)[number];
const isValidGitAction = (action: string): action is GitFileAction => {
  return (validGitActions as readonly string[]).includes(action);
};

const gitFileActionsToModType: Record<GitFileAction, ModType | null> = {
  M: "MODIFIED",
  T: "MODIFIED",
  A: "ADDED",
  D: "REMOVED",
  U: "MODIFIED",
  R: null,
  C: null,
  "??": "UNTRACKED",
};

export class GitCliRunner implements GitRunner {
  private cmdRunner: CommandRunner = new ShellRunner();
  constructor(cmdRunner?: CommandRunner) {
    if (cmdRunner) {
      this.cmdRunner = cmdRunner;
    }
  }

  private async safeRun(
    command: string,
    args: string[],
    options?: CommandOptions,
  ): Promise<string[]> {
    const res = await this.cmdRunner.run(command, args, {
      cwd: options?.cwd || process.cwd(),
    });

    if (res.exitCode !== 0) {
      throw new GitError(res.stderr.join("\n"), res.command);
    }

    return res.stdout;
  }

  async cloneRepository(url: string): Promise<string> {
    const tempFolder = `/tmp/${uuidv4()}`;
    await this.safeRun("git", [
      "clone",
      "--depth=1",
      "--single-branch",
      url,
      tempFolder,
    ]);
    return tempFolder;
  }

  async isValidRepository(path: string): Promise<boolean> {
    const res = await this.cmdRunner.run(
      "git",
      ["rev-parse", "--is-inside-work-tree"],
      { cwd: path },
    );
    return res.exitCode === 0;
  }

  async getCurrentBranch(path: string): Promise<string> {
    const res = await this.safeRun(
      "git",
      ["rev-parse", "--abbrev-ref", "HEAD"],
      { cwd: path },
    );
    return res[0];
  }

  async getCurrentRemote(path: string): Promise<Remote> {
    const lines = await this.safeRun("git", ["remote", "-v"], {
      cwd: path,
    });

    const cache: string[] = [];
    const remotes: Remote[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split("\t");
      if (parts.length !== 2) {
        throw new Error(`Failed to parse CLI remote -v line: ${line}`);
      }
      const name = parts[0];
      if (cache.includes(name)) {
        continue;
      }

      const urlVerb = parts[1].split(" ");
      if (urlVerb.length !== 2) {
        throw new Error(`Failed to parse CLI remote -v line: ${line}`);
      }
      const url = urlVerb[0];

      remotes.push({ name, url });
    }

    return remotes[0];
  }

  async getRepoDiff(
    repositoryPath: string,
    staged: boolean = false,
  ): Promise<string[]> {
    const args = ["diff", "--no-color", "--word-diff=porcelain"];
    if (staged) {
      args.push("--cached");
    }
    const lines = await this.safeRun(
      "git",
      ["diff", "--no-color", "--word-diff=porcelain"],
      { trimOutput: false, cwd: repositoryPath },
    );
    parseDiff(lines);
    return lines;
  }

  async getModifiedFiles(path: string): Promise<ChangedFile[]> {
    const lines = await this.safeRun("git", ["status", "--porcelain"], {
      cwd: path,
    });

    const files: ChangedFile[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(" ");

      if (parts.length !== 2) {
        console.error(`Malformed git status --porcelain line: ${line}`);
        continue;
      }

      const action = parts[0];
      if (!isValidGitAction(action)) {
        console.error(
          `Unknown git status --porcelain file action ${action} on line: ${line}`,
        );
        continue;
      }
      if (gitFileActionsToModType[action] === null) {
        continue;
      }
      const filePath = parts[1];
      files.push({ path: filePath, modType: gitFileActionsToModType[action] });
    }

    return files;
  }

  async listRefs(path: string): Promise<RepositoryReferences> {
    const lines = await this.safeRun(
      "git",
      [
        "for-each-ref",
        "--format='%(refname:short) %(refname) %(upstream:remotename)'",
        "refs/heads",
        "refs/remotes",
      ],
      { cwd: path },
    );
    const rv: RepositoryReferences = { local: [], remote: [] };
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.startsWith("'")) {
        line = line.slice(1);
      }
      if (line.endsWith("'")) {
        line = line.slice(0, line.length - 1);
      }
      const parts = line.split(" ");
      if (parts.length < 2 || parts.length > 3) {
        console.warn(
          `Seemingly malformed git for-each-ref output line: ${line}`,
        );
        continue;
      }

      const shortRefName = parts[0];
      const refName = parts[1];
      if (refName.startsWith("refs/remotes/") && refName.endsWith("/HEAD")) {
        continue;
      }

      if (refName.startsWith("refs/head")) {
        rv.local.push({
          name: shortRefName,
        });
      } else {
        const refNameParts = shortRefName.split("/");
        const remoteName = refNameParts.shift();

        if (!remoteName) {
          console.warn(
            `Seemingly malformed git for-each-ref output line: ${line}`,
          );
          continue;
        }
        const branchName = refNameParts.join("/");
        rv.remote.push({ name: branchName, remoteName });
      }
    }

    return rv;
  }

  async listBranches(path: string, currentBranchName: string) {
    const lines = await this.safeRun(
      "git",
      [
        "for-each-ref",
        "--format='%(refname:short) %(refname) %(upstream:short)'",
        "refs/heads",
        "refs/remotes",
      ],
      { cwd: path },
    );
    const branchesMap: Map<string, Branch> = new Map();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(" ");
      if (parts.length < 2 || parts.length > 3) {
        console.warn(
          `Seemingly malformed git for-each-ref output line: ${line}`,
        );
        continue;
      }

      const shortRefName = parts[0];
      const refName = parts[1];
      const upstream = parts[2];

      if (refName.startsWith("refs/head")) {
        if (branchesMap.has(shortRefName)) {
          const existingBranch = branchesMap.get(shortRefName)!;
          if (!existingBranch.isLocal) {
            existingBranch.isLocal = true;
            branchesMap.set(shortRefName, existingBranch);
          }
        } else {
          branchesMap.set(shortRefName, {
            isCurrent: shortRefName === currentBranchName,
            isLocal: true,
            name: shortRefName,
            remote: upstream ? upstream.split("/")[0] : undefined,
          });
        }
      } else if (refName.startsWith("refs/remote")) {
        const refNameParts = shortRefName.split("/");
        if (refNameParts.length < 2) {
          console.warn(
            `Seemingly malformed git for-each-ref output line: ${line}`,
          );
          continue;
        }
        const branchName = refNameParts.pop();
        const remoteName = refNameParts[0];
        if (!branchName || !remoteName) {
          console.warn(
            `Seemingly malformed git for-each-ref output line: ${line}`,
          );
          continue;
        }
        if (branchesMap.has(branchName)) {
          const existingBranch = branchesMap.get(branchName)!;
          if (!existingBranch.remote) {
            existingBranch.remote = remoteName;
            branchesMap.set(branchName, existingBranch);
          }
        } else {
          branchesMap.set(branchName, {
            isCurrent: branchName === currentBranchName,
            isLocal: false,
            name: branchName,
            remote: remoteName,
          });
        }
      }
    }

    return Array.from(branchesMap.values());
  }
}
