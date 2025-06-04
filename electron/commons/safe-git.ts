import { BrowserWindow } from "electron";

import { GitError } from "../modules/repository/domain/git-error.js";

export async function safeGit<T>(
  promise: Promise<T>,
  window: BrowserWindow,
): Promise<T> {
  return promise.catch((err) => {
    if (err instanceof GitError) {
      window.webContents.send("git-error", {
        message: err.message,
        command: err.command,
      });
    }
    throw err;
  });
}
