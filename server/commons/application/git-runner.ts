import { CommandOptions } from "./command-runner.js";

export interface GitRunner {
  safeRun(
    command: string,
    args: string[],
    options?: CommandOptions,
  ): Promise<string[]>;
}
