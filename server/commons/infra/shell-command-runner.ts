import { spawn } from "child_process";

import {
  CommandArgs,
  CommandOptions,
  CommandResult,
  CommandRunner,
} from "../application/command-runner.js";

export class ShellRunner implements CommandRunner {
  private env: Record<string, string | undefined>;

  constructor(env: Record<string, string | undefined> = {}) {
    this.env = env;
  }

  private splitLines(output: string, trim: boolean): string[] {
    const lines: string[] = [];
    const rawLines = output.split("\n");

    for (let i = 0; i < rawLines.length; i++) {
      const rawLine = trim ? rawLines[i].trim() : rawLines[i];
      if (!rawLine) {
        continue;
      }
      lines.push(rawLine);
    }
    return lines;
  }

  async pipe(piped: CommandArgs, pipee: CommandArgs): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
      const pipedCmd = spawn(piped.cmd, piped.args, {
        cwd: piped.options?.cwd || process.cwd(),
        env: { ...this.env, ...piped.options?.env },
        shell:
          piped.options?.shell !== undefined ? piped.options?.shell : false,
      });

      const pipeeCmd = spawn(pipee.cmd, pipee.args, {
        cwd: pipee.options?.cwd || process.cwd(),
        env: { ...this.env, ...pipee.options?.env },
        shell:
          pipee.options?.shell !== undefined ? pipee.options?.shell : false,
      });

      pipedCmd.stdout.pipe(pipeeCmd.stdin);

      let stdout = "";
      let stderr = "";
      let exited = false;

      pipeeCmd.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      pipeeCmd.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      const handleExit = (code: number | null) => {
        if (exited) return;
        exited = true;

        resolve({
          command: `${piped.cmd} ${piped.args?.join(" ") ?? ""} | ${pipee.cmd} ${pipee.args?.join(" ") ?? ""}`,
          stdout: this.splitLines(stdout, pipee.options?.trimOutput ?? true),
          stderr: this.splitLines(stderr, pipee.options?.trimOutput ?? true),
          exitCode: code ?? -1,
        });
      };

      pipeeCmd.on("exit", (code) => handleExit(code));
      pipedCmd.on("error", reject);
      pipeeCmd.on("error", reject);
    });
  }

  async run(
    command: string,
    args: string[] = [],
    options?: CommandOptions,
  ): Promise<CommandResult> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: options?.cwd || process.cwd(),
        shell: options?.shell ? options?.shell : false,
        env: {
          ...process.env,
          ...this.env,
        },
      });

      let stdout = "";
      let stderr = "";
      let stdin = "";
      let exited = false;

      child.stdin?.on("data", (data) => {
        stdin += data.toString();
      });
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
