import {
  CommandOptions,
  CommandRunner,
} from "../application/command-runner.js";
import { GitRunner } from "../application/git-runner.js";
import { GitError } from "../errors.js";

export type CommandRunnerArgs = {
  command: string;
  args: string[];
  splitLines?: boolean;
  expectedCodes?: number[];
  options?: CommandOptions;
};

export class GitCliRunner implements GitRunner {
  constructor(protected readonly cmdRunner: CommandRunner) {}
  async safeRun(
    command: string,
    args: string[],
    options: CommandOptions,
    splitLines?: true,
    expectedCodes?: number[],
  ): Promise<string[]>;

  async safeRun(
    command: string,
    args: string[],
    options: CommandOptions,
    splitLines?: false,
    expectedCodes?: number[],
  ): Promise<string>;

  async safeRun(
    command: string,
    args: string[],
    options: CommandOptions,
    splitLines?: undefined,
    expectedCodes?: number[],
  ): Promise<string[]>;

  async safeRun(
    command: string,
    args: string[],
    options: CommandOptions,
    splitLines?: boolean,
    expectedCodes?: number[],
  ): Promise<string[] | string> {
    let validatedExpectedCodes = expectedCodes;
    if (validatedExpectedCodes === undefined) {
      validatedExpectedCodes = [0];
    }

    let validatedSplitLines = splitLines;
    if (validatedSplitLines === undefined) {
      validatedSplitLines = true;
    }

    const repositoryPath = (options?.cwd || process.cwd()) as string;

    const res = await this.cmdRunner.run(command, args, {
      cwd: repositoryPath,
      splitLines: validatedSplitLines,
      ...options,
    });

    if (!validatedExpectedCodes.includes(res.exitCode)) {
      throw new GitError(
        res.exitCode,
        typeof res.stderr === "string" ? res.stderr : res.stderr.join("\n"),
        repositoryPath,
        res.command,
      );
    }

    return res.stdout;
  }
}
