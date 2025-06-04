import { ExecOptionsWithStringEncoding, execSync } from "child_process";

import { v4 as uuidv4 } from "uuid";
import Git from "nodegit";

import { GitRunner } from "../application/git-runner.js";
import { RepositoryRemote } from "../dto/remote.js";
import { GitError } from "../domain/git-error.js";
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

  private cleanLine(output: string): string {
    return output.replace("\n", "");
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

  async getCurrentRemote(path: string): Promise<RepositoryRemote> {
    const commandResult = this.runCommand(`git remote -v`, {
      cwd: path,
      encoding: "utf8",
    });
    const lines = commandResult.split("\n").filter((_) => _);

    const cache: string[] = [];
    const remotes: RepositoryRemote[] = [];
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
      const verb = urlVerb[1];

      remotes.push({ name, url, verb });
    }

    return remotes[0];
  }

  async getFileDiff(filePath: string, repositoryPath: string): Promise<void> {
    
  }

  async getModifiedFiles(path: string): Promise<ChangedFile[]> {
    const rv = this.runCommand("git status --porcelain", {
      cwd: path,
      encoding: "utf8",
    });
    const files: ChangedFile[] = [];
    const rawLines = rv.split("\n");
    for (let i = 0; i < rawLines.length; i++) {
      if (!rawLines[i]) {
        continue;
      }
      const line = rawLines[i].trim();
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

  async listBranches(path: string, remoteName: string): Promise<string[]> {
    const rv = this.runCommand(`git ls-remote ${remoteName}`, {
      cwd: path,
      encoding: "utf-8",
    });
    const lines = rv.split("\n").filter((_) => _);
    const branches: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const splitted = line.split("\t");
      if (splitted.length < 2) {
        console.warn(`Malformed git ls-remote line: ${line}`);
        continue;
      }

      let refName = splitted[1];
      refName = refName.replace("\n", "").trim();
      if (refName.startsWith("refs/heads/")) {
        branches.push(refName.replace("refs/heads/", ""));
      }
    }
    return branches;
  }
}

const runner = new GitCliRunner();
runner
  .getModifiedFiles("/home/alexis-haim/upscale/upscale-backend")
  .then((res) => console.log(res));
