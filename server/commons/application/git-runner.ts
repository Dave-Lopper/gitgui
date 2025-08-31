import { CommandOptions } from "../command-runner";

export interface GitRunner {
  safeRun(
    command: string,
    args: string[],
    options?: CommandOptions,
  ): Promise<string[]>;
}
