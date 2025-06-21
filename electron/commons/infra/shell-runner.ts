import { spawn, ExecOptions } from "child_process";

import {
  CommandOptions,
  CommandResult,
  CommandRunner,
} from "../application/command-runner.js";

export class ShellRunner implements CommandRunner {
  private splitLines(output: string, trim: boolean): string[] {
    const lines = [];
    const rawLines = output.split("\n");

    for (let i = 0; i < rawLines.length; i++) {
      // const rawLine = rawLines[i].trim();
      const rawLine = rawLines[i];
      if (!rawLine) {
        continue;
      }
      lines.push(rawLine);
    }
    return lines;
  }

  async run(
    command: string,
    args: string[] = [],
    options?: CommandOptions,
  ): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: options?.cwd || process.cwd(),
        shell: false,
        env: {
          ...process.env,
          GIT_PAGER: "cat",
          PATH: process.env.PATH + ":/usr/bin",
        },
      });

      let stdout = "";
      let stderr = "";
      let exited = false;

      child.stdout?.on("data", (data) => {
        stdout += data.toString();
      });
      child.stdout?.resume();
      child.stderr?.on("data", (data) => {
        stderr += data.toString();
      });
      child.stderr?.resume();

      child.on("error", (error) => {
        if (!exited) {
          exited = true;
          reject(error);
        }
      });

      child.on("exit", (code) => {
        if (!exited) {
          exited = true;

          resolve({
            command: `${command} ${args.join(" ")}`,
            stdout: this.splitLines(stdout, options?.trimOutput ?? true),
            stderr: this.splitLines(stderr, options?.trimOutput ?? true),
            exitCode: code ?? -1,
          });
        }
      });
    });
  }
}
