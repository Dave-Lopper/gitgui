import { ExecOptionsWithStringEncoding, execSync } from "child_process";

import { v4 as uuidv4 } from "uuid";

import { GitRunner } from "../application/git-runner.js";
import { Branch } from "../domain/branch.js";
import { GitError } from "../domain/git-error.js";
import { Remote } from "../dto/remote.js";
import { ChangedFile, ModType } from "../domain/changed-file.js";

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
  private runCommand(
    command: string,
    options: ExecOptionsWithStringEncoding,
  ): string {
    try {
      const results = execSync(command, options);
      return results;
    } catch (error) {
      const errorAsUnknown = error as unknown;
      const stdErrInError =
        typeof errorAsUnknown === "object" &&
        errorAsUnknown !== null &&
        "stderr" in errorAsUnknown &&
        errorAsUnknown.stderr;

      if (!stdErrInError) {
        throw error;
      }

      let cliMessage: string;
      if (typeof errorAsUnknown.stderr === "string") {
        cliMessage = errorAsUnknown.stderr;
      } else if (Buffer.isBuffer(errorAsUnknown.stderr)) {
        cliMessage = errorAsUnknown.stderr.toString("utf8");
      } else {
        throw new Error(
          `Unsupported error.stdErr type: ${typeof errorAsUnknown.stderr}`,
        );
      }

      throw new GitError(cliMessage, command);
    }
  }

  private splitLines(output: string): string[] {
    const lines = [];
    const rawLines = output.split("\n");

    for (let i = 0; i < rawLines.length; i++) {
      const rawLine = rawLines[i].trim();
      if (!rawLine) {
        continue;
      }
      lines.push(rawLine);
    }
    return lines;
  }

  private cleanLine(output: string): string {
    return output.replace("\n", "");
  }

  async listRemotes(path: string): Promise<Remote[]> {
    const commandResult = this.runCommand(
      "git remote -v | awk '{print $1, $2}' | uniq",
      { encoding: "utf8", cwd: path },
    );

    const lines = this.splitLines(commandResult);
    const remotes = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(" ");
      if (parts.length !== 2) {
        console.warn(
          `Seemingly malformed git remote -v output line: ${lines[i]}`,
        );
        continue;
      }

      remotes.push({ name: parts[0], url: parts[1] });
    }
    return remotes;
  }

  async cloneRepository(url: string): Promise<string> {
    const tempFolder = `/tmp/${uuidv4()}`;
    // TODO: Sanitize for command injection
    const command = `git clone --depth=1 --single-branch ${url} ${tempFolder}`;
    this.runCommand(command, { encoding: "utf8" });
    return tempFolder;
  }

  async isValidRepository(path: string): Promise<boolean> {
    try {
      const commandResult = execSync(`git rev-parse --is-inside-work-tree`, {
        cwd: path,
        encoding: "utf-8",
      });

      const value = this.cleanLine(commandResult);
      return value === "true";
    } catch (err) {
      return false;
    }
  }

  async getCurrentBranch(path: string): Promise<string> {
    const commandResult = this.runCommand(`git rev-parse --abbrev-ref HEAD`, {
      cwd: path,
      encoding: "utf8",
    });
    const value = this.cleanLine(commandResult);
    return value;
  }

  async getCurrentRemote(path: string): Promise<Remote> {
    const commandResult = this.runCommand(`git remote -v`, {
      cwd: path,
      encoding: "utf8",
    });
    const lines = this.splitLines(commandResult);

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

  async getFileDiff(filePath: string, repositoryPath: string): Promise<void> {}

  async getModifiedFiles(path: string): Promise<ChangedFile[]> {
    const rv = this.runCommand("git status --porcelain", {
      cwd: path,
      encoding: "utf8",
    });
    const files: ChangedFile[] = [];
    const lines = this.splitLines(rv);
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

  async listBranches(
    path: string,
    currentBranchName: string,
  ): Promise<Branch[]> {
    const commandResult = this.runCommand(
      "git for-each-ref --format='%(refname:short) %(refname) %(upstream:short)' refs/heads refs/remotes",
      { encoding: "utf8", cwd: path },
    );
    const lines = this.splitLines(commandResult);
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
