import { ExecOptions } from "child_process";

export interface CommandResult {
  command: string;
  stdout: string[];
  stderr: string[];
  exitCode: number;
}

export type CommandOptions = ExecOptions & { trimOutput?: boolean };

export interface CommandRunner {
  run(
    cmd: string,
    args: string[],
    options?: CommandOptions,
  ): Promise<CommandResult>;
}
