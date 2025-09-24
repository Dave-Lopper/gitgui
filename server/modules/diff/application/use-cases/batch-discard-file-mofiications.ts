import * as path from "path";

import { BrowserWindow } from "electron";

import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffCliGitRunner } from "../../infra/diff-git-cli-runner.js";
import { parseStatus } from "../../domain/services.js";

export class BatchDiscardFileModifications {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly gitRunner: DiffCliGitRunner,
  ) {}

  async execute(
    repositoryPath: string,
    filePaths: string[],
    window: BrowserWindow,
  ): Promise<void> {
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
          window,
        );
      }
    }
  }
}
