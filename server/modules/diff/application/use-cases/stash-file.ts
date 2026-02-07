import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffGitRunner } from "../git-runner.js";

export class StashFile {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: DiffGitRunner,
  ) {}

  async execute(repositoryPath: string, filePath: string): Promise<void> {
    await safeGit(
      this.gitRunner.stashFile(repositoryPath, filePath),
      this.eventEmitter,
    );
  }
}
