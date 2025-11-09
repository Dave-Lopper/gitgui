import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepositoryGitRunner } from "../../../repository/application/git-runner.js";
import { RepoStatusService } from "../../../status/application/services/repo-status.js";
import { StatusEntry } from "../../../status/domain/entities.js";
import { File, Hunk } from "../../domain/entities.js";
import {
  getOneSidedDiff,
  parseFileDiff,
  parseFileNumStat,
} from "../../domain/services.js";
import { DiffGitRunner } from "../git-runner.js";

export class GetRepoDiff {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly filesRepository: FilesRepository,
    private readonly diffGitRunner: DiffGitRunner,
    private readonly repositoryGitRunner: RepositoryGitRunner,
    private readonly repoStatusService: RepoStatusService,
  ) {}

  async processFile(
    currentBranchName: string,
    currentRemoteName: string,
    repositoryPath: string,
    statusEntry: StatusEntry,
  ): Promise<
    { addedLines: number; hunks: Hunk[]; removedLines: number } | undefined
  > {
    let removedLines: number;
    let addedLines: number;

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
      addedLines = 1;
    } else if (statusEntry.status === "REMOVED") {
      addedLines = 0;
      removedLines = 1;
    } else {
      console.warn("CONTINUE");
      return;
    }

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
        return { addedLines, hunks: parseFileDiff(rawFileDiff), removedLines };
      case "ADDED":
        fileContents = await this.filesRepository.readFile(statusEntry.path);
        return {
          addedLines,
          hunks: [getOneSidedDiff(fileContents, "ADDED")],
          removedLines,
        };
      case "REMOVED":
        fileContents = await safeGit(
          this.diffGitRunner.getHeadFileContents(
            currentBranchName,
            currentRemoteName,
            repositoryPath,
            statusEntry.path,
          ),
          this.eventEmitter,
        );
        return {
          addedLines,
          hunks: [getOneSidedDiff(fileContents, "REMOVED")],
          removedLines,
        };
    }
  }

  async execute(repositoryPath: string): Promise<File[]> {
    const treeStatus = await this.repoStatusService.execute(repositoryPath);
    for (let i = 0; i < treeStatus.entries.length; i++) {}
    const currentBranch =
      await this.repositoryGitRunner.getCurrentBranch(repositoryPath);
    const currentRemote =
      await this.repositoryGitRunner.getCurrentRemote(repositoryPath);

    const files = [];
    for (let i = 0; i < treeStatus.entries.length; i++) {
      const statusEntry = treeStatus.entries[i];
      const isFile = await this.filesRepository.isFile(
        `${repositoryPath}/${statusEntry.path}`,
      );

      if (!isFile) {
        continue;
      }

      const fileResults = await this.processFile(
        currentBranch,
        currentRemote.name,
        repositoryPath,
        statusEntry,
      );
      if (fileResults) {
        const file = {
          ...statusEntry,
          ...fileResults,
        };
        files.push(file);
      }
    }

    return files.filter((file) => file !== undefined);
  }
}
