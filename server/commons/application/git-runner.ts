import { CommandOptions } from "./command-runner.js";

export interface GitRunner {
  safeRun(
    command: string,
    args: string[],
    options: CommandOptions,
    splitLines?: true,
    expectedCodes?: number[],
  ): Promise<string[]>;

  safeRun(
    command: string,
    args: string[],
    options: CommandOptions,
    splitLines?: false,
    expectedCodes?: number[],
  ): Promise<string>;

  safeRun(
    command: string,
    args: string[],
    options: CommandOptions,
    splitLines?: undefined,
    expectedCodes?: number[],
  ): Promise<string[]>;
}
