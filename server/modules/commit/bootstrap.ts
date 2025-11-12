import { BrowserWindow } from "electron";

import { ElectronEventEmitter } from "../../commons/infra/electron-event-emitter.js";
import { GITENV } from "../../commons/infra/git-env.js";
import { ShellRunner } from "../../commons/infra/shell-command-runner.js";
import { CommitUseCase } from "./application/use-cases/commit.js";
import { GetHistory } from "./application/use-cases/get-history.js";
import { CommitGitCliRunner } from "./infra/commit-cli-git-runner.js";

export function bootstrap(window: BrowserWindow) {
  const eventEmitter = new ElectronEventEmitter(window);
  const shellRunner = new ShellRunner({ ...process.env, ...GITENV });
  const gitRunner = new CommitGitCliRunner(shellRunner);
  return {
    commit: new CommitUseCase(eventEmitter, gitRunner),
    getHistory: new GetHistory(eventEmitter, gitRunner),
  };
}
