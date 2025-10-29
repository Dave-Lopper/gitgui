import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepositoryGitRunner } from "../../../repository/application/git-runner.js";
import { File } from "../../domain/entities.js";
import {
  getOneSidedDiff,
  parseFileDiff,
  parseFileNumStat,
  parseStatus,
} from "../../domain/services.js";
import { DiffGitRunner } from "../git-runner.js";

export class GetRepoDiff {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly filesRepository: FilesRepository,
    private readonly diffGitRunner: DiffGitRunner,
    private readonly repositoryGitRunner: RepositoryGitRunner,
  ) {}
  async execute(repositoryPath: string): Promise<File[]> {
    const statusLines = await safeGit(
      this.diffGitRunner.getRepoStatus(repositoryPath),
      this.eventEmitter,
    );
    const statusEntries = parseStatus(statusLines);
    const files = [];
    const currentBranch =
      await this.repositoryGitRunner.getCurrentBranch(repositoryPath);
    const currentRemote =
      await this.repositoryGitRunner.getCurrentRemote(repositoryPath);

    for (let i = 0; i < statusEntries.length; i++) {
      const statusEntry = statusEntries[i];
      let oldLineCount: number = 0;
      let newLineCount: number = 0;
      let removedLines: number;
      let addedLines: number;

      if (statusEntry.status !== "ADDED") {
        oldLineCount = parseInt(
          await safeGit(
            this.diffGitRunner.getHeadFileLinecount(
              repositoryPath,
              statusEntry.path,
            ),
            this.eventEmitter,
          ),
        );
      }

      if (statusEntry.status !== "REMOVED") {
        newLineCount = await this.filesRepository.countLines(
          `${repositoryPath}/${statusEntry.path}`,
        );
      }

      if (statusEntry.status === "MODIFIED") {
        const numStatLine = await safeGit(
          this.diffGitRunner.getFileNumStats(
            repositoryPath,
            statusEntry.path,
            statusEntry.staged,
          ),
          this.eventEmitter,
        );
        [addedLines, removedLines] = parseFileNumStat(numStatLine);
      } else if (statusEntry.status === "ADDED") {
        removedLines = 0;
        addedLines = newLineCount!;
      } else if (statusEntry.status === "REMOVED") {
        addedLines = 0;
        removedLines = oldLineCount!;
      } else {
        console.warn("CONTINUE");
        continue;
      }

      const fileInfos = {
        addedLines,
        newLineCount,
        oldLineCount,
        path: statusEntry.path,
        removedLines,
        staged: statusEntry.staged,
        status: statusEntry.status,
      };

      let fileContents: string;
      switch (statusEntry.status) {
        case "MODIFIED":
          const rawFileDiff = await safeGit(
            this.diffGitRunner.getFileDiff(
              repositoryPath,
              statusEntry.path,
              statusEntry.staged,
            ),
            this.eventEmitter,
          );
          files.push(parseFileDiff(rawFileDiff, fileInfos));
          break;
        case "ADDED":
          fileContents = await this.filesRepository.readFile(statusEntry.path);
          files.push(getOneSidedDiff(fileContents, fileInfos, "ADDED"));
          break;
        case "REMOVED":
          fileContents = await safeGit(
            this.diffGitRunner.getHeadFileContents(
              currentBranch,
              currentRemote.name,
              repositoryPath,
              statusEntry.path,
            ),
            this.eventEmitter,
          );
          files.push(getOneSidedDiff(fileContents, fileInfos, "REMOVED"));
          break;
      }
    }

    return files;
  }
}
