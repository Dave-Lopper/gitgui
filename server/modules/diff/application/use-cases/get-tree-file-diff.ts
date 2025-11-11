import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffEntry } from "../../domain/entities.js";
import { parseFileDiff, parseFileNumStat } from "../../domain/services.js";
import { DiffGitRunner } from "../git-runner.js";

export class GetTreeFileDiff {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: DiffGitRunner,
  ) {}

  async execute(
    repositoryPath: string,
    filePath: string,
    staged: boolean,
  ): Promise<DiffEntry> {
    const rawdiff = await safeGit(
      this.gitRunner.getFileDiff(repositoryPath, filePath, staged),
      this.eventEmitter,
    );
    const hunks = parseFileDiff(rawdiff);
    const numstatLines = await safeGit(
      this.gitRunner.getFileNumStats(repositoryPath, filePath, staged),
      this.eventEmitter,
    );
    const numstat = parseFileNumStat(numstatLines);

    return {
      addedLines: numstat[0],
      removedLines: numstat[1],
      hunks,
    };
  }
}
