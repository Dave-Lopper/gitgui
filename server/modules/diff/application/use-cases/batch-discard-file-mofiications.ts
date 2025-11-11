import * as path from "path";

import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepoStatusService } from "../../../status/application/services/repo-status.js";
import { DiffGitRunner } from "../git-runner.js";

export class BatchDiscardFileModifications {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly filesRepository: FilesRepository,
    private readonly gitRunner: DiffGitRunner,
    private readonly repoStatusService: RepoStatusService,
  ) {}

  async execute(repositoryPath: string, filePaths: string[]): Promise<void> {
    const treeStatus = await this.repoStatusService.execute(repositoryPath);
    const addedUntrackedEntries = treeStatus.entries
      .filter((entry) => entry.status === "ADDED")
      .map((entry) => entry.path);

    for (let i = 0; i < filePaths.length; i++) {
      if (addedUntrackedEntries.includes(filePaths[i])) {
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
