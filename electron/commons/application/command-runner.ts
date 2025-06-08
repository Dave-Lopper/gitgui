import { ExecOptions } from "child_process";

export interface CommandResult {
  command: string;
  stdout: string[];
  stderr: string[];
  exitCode: number;
}

export interface CommandRunner {
  run(
    cmd: string,
    args: string[],
    options?: ExecOptions,
  ): Promise<CommandResult>;
}
