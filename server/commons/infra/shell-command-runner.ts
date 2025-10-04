import { spawn, ExecOptions } from "child_process";

import {
  CommandOptions,
  CommandResult,
  CommandRunner,
} from "../application/command-runner.js";

export class ShellRunner implements CommandRunner {
  private env: Record<string, string>;

  constructor(env: Record<string, string> = {}) {
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
          ...this.env,
          
        },
      });

      let stdout = "";
      let stderr = "";
      let stdin = "";
      let exited = false;

      child.stdin?.on("data", (data) => {
        // console.log("[STDIN]", data.toString(), "[STDINEND]");
        stdin += data.toString();
      });
      child.stdout?.on("data", (data) => {
        // console.log("[STDOUT]", data.toString(), "[STDOUTEND]");
        stdout += data.toString();
      });
      child.stdout?.resume();
      child.stderr?.on("data", (data) => {
        // console.log("[STDERR]", data.toString(), "[STDERREND]");
        stderr += data.toString();
      });
      child.stderr?.resume();

      child.on("error", (error) => {
        if (!exited) {
          exited = true;
          reject(error);
        }
      });

      // console.log({ stdin });

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
