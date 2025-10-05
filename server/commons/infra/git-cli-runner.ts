import {
  CommandOptions,
  CommandRunner,
} from "../application/command-runner.js";
import { GitRunner } from "../application/git-runner.js";
import { GitError } from "../errors.js";

export class GitCliRunner implements GitRunner {
  constructor(protected readonly cmdRunner: CommandRunner) {}

  async safeRun(
    command: string,
    args: string[],
    options?: CommandOptions,
    expectedCodes: number[] = [0],
  ): Promise<string[]> {
    const res = await this.cmdRunner.run(command, args, {
      cwd: options?.cwd || process.cwd(),
    });

    if (!expectedCodes.includes(res.exitCode)) {
      throw new GitError(res.exitCode, res.stderr.join("\n"), res.command);
    }

    return res.stdout;
  }
}
