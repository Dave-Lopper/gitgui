import { writeFileSync } from "fs";

import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepositoryGitRunner } from "../../../repository/application/git-runner.js";
import { File, StatusEntry } from "../../domain/entities.js";
import {
  getOneSidedDiff,
  parseFileDiff,
  parseFileDiff2,
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

  async processFile(
    currentBranchName: string,
    currentRemoteName: string,
    repositoryPath: string,
    statusEntry: StatusEntry,
  ): Promise<File | undefined> {
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
      return;
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
        // writeFileSync("rawdiff.txt", rawFileDiff);
        return parseFileDiff2(rawFileDiff, fileInfos);
      case "ADDED":
        fileContents = await this.filesRepository.readFile(statusEntry.path);
        return getOneSidedDiff(fileContents, fileInfos, "ADDED");
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
        return getOneSidedDiff(fileContents, fileInfos, "REMOVED");
    }
  }

  async execute(repositoryPath: string): Promise<File[]> {
    const statusLines = await safeGit(
      this.diffGitRunner.getRepoStatus(repositoryPath),
      this.eventEmitter,
    );
    const statusEntries = parseStatus(statusLines);
    const currentBranch =
      await this.repositoryGitRunner.getCurrentBranch(repositoryPath);
    const currentRemote =
      await this.repositoryGitRunner.getCurrentRemote(repositoryPath);

    // const fileProcesses = statusEntries.map((statusEntry) =>
    //   this.processFile(
    //     currentBranch,
    //     currentRemote.name,
    //     repositoryPath,
    //     statusEntry,
    //   ),
    // );
    // const files = (await Promise.all(fileProcesses)).filter(
    //   (file) => file !== undefined,
    // );

    const files = [];
    for (let i = 0; i < statusEntries.length; i++) {
      const statusEntry = statusEntries[i];
      const isFile = await this.filesRepository.isFile(
        `${repositoryPath}/${statusEntry.path}`,
      );

      if (!isFile) {
        continue;
      }

      const file = await this.processFile(
        currentBranch,
        currentRemote.name,
        repositoryPath,
        statusEntry,
      );
      files.push(file);
    }

    return files.filter((file) => file !== undefined);
  }
}
