import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffEntry } from "../../../diff/domain/entities.js";
import {
  parseFileDiff,
  parseFileNumStat,
} from "../../../diff/domain/services.js";
import { CommitGitRunner } from "../git-runner.js";

export class GetCommitFileDiff {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: CommitGitRunner,
  ) {}

  async execute(
    repositoryPath: string,
    commitHash: string,
    filePath: string,
  ): Promise<DiffEntry> {
    const rawDiff = await safeGit(
      this.gitRunner.getCommitFileDiff(repositoryPath, commitHash, filePath),
      this.eventEmitter,
    );
    const hunks = parseFileDiff(rawDiff);
    const rawNumStats = await safeGit(
      this.gitRunner.getCommitFileStats(repositoryPath, commitHash, filePath),
      this.eventEmitter,
    );
    let numstats: number[];
    if (rawNumStats.length >= 5) {
      console.log({
        RAWNUMSTAT: rawNumStats[4],
        len: rawNumStats.length,
        rawNumStats,
      });
      numstats = parseFileNumStat(rawNumStats[4]);
    } else {
      numstats = [0, 0];
    }

    return { addedLines: numstats[0], removedLines: numstats[1], hunks };
  }
}
