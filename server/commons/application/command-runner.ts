import { SpawnOptions } from "child_process";

export type CommandResult = {
  command: string;
  stdout: string[] | string;
  stderr: string[] | string;
  exitCode: number;
};

export type CommandOptions = SpawnOptions & {
  trimOutput?: boolean;
  splitLines?: boolean;
};

export type CommandArgs = {
  cmd: string;
  args: string[];
  options: CommandOptions;
};

export interface CommandRunner {
  pipe(piped: CommandArgs, pipee: CommandArgs): Promise<CommandResult>;

  run(
    cmd: string,
    args: string[],
    options?: CommandOptions,
  ): Promise<CommandResult>;
}
