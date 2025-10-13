import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffGitRunner } from "../git-runner.js";

export class ToggleFileStaged {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: DiffGitRunner,
  ) {}

  async execute(repositoryPath: string, filePaths: string[]): Promise<void> {
    filePaths.forEach(async (filePath) => {
      const isStaged =
        (
          await safeGit(
            this.gitRunner.getStagedFileByName(repositoryPath, filePath),
            this.eventEmitter,
          )
        ).length > 0;

      if (isStaged) {
        await safeGit(
          this.gitRunner.unstageFile(repositoryPath, filePath),
          this.eventEmitter,
        );
      } else {
        await safeGit(
          this.gitRunner.stageFile(repositoryPath, filePath),
          this.eventEmitter,
        );
      }
    });
  }
}
