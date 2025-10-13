import * as path from "path";

import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { parseStatus } from "../../domain/services.js";
import { DiffGitRunner } from "../git-runner.js";

export class BatchDiscardFileModifications {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly filesRepository: FilesRepository,
    private readonly gitRunner: DiffGitRunner,
  ) {}

  async execute(repositoryPath: string, filePaths: string[]): Promise<void> {
    const repoStatusLines = await this.gitRunner.getRepoStatus(repositoryPath);
    const addedUntrackedFiles = parseStatus(repoStatusLines);

    for (let i = 0; i < filePaths.length; i++) {
      if (addedUntrackedFiles.includes(filePaths[i])) {
        await this.filesRepository.removeFile(
          path.join(repositoryPath, filePaths[i]),
        );
      } else {
        await safeGit(
          this.gitRunner.discardFileChanges(repositoryPath, filePaths[i]),
          this.eventEmitter,
        );
      }
    }
  }
}
