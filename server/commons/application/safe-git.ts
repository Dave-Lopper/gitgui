import { IEventEmitter } from "./i-event-emitter.js";
import { GitError } from "../errors.js";

export async function safeGit<T>(
  promise: Promise<T>,
  eventEmitter: IEventEmitter,
): Promise<T> {
  return promise.catch((err) => {
    if (err instanceof GitError) {
      eventEmitter.send("git-error", {
        message: err.message,
        command: err.command,
      });
    }
    throw err;
  });
}
