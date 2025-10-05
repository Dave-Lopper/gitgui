import { GitError } from "../errors.js";
import { IEventEmitter } from "./i-event-emitter.js";

export async function safeGit<T>(
  promise: Promise<T>,
  eventEmitter: IEventEmitter,
): Promise<T> {
  return promise.catch((err) => {
    if (err instanceof GitError) {
      if (
        err.code === 128 &&
        (err.message.toLowerCase().includes("authentication") ||
          err.message.toLowerCase().includes("username"))
      ) {
        eventEmitter.send("git:auth", { repositoryPath: err.repositoryPath });
      } else {
        eventEmitter.send("git:error", {
          message: err.message,
          command: err.command,
          repositoryPath: err.repositoryPath,
        });
      }
    }
    throw err;
  });
}
