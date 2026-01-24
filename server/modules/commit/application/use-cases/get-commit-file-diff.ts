import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import {
  DiffEntry,
  DiffRepresentation,
} from "../../../diff/domain/entities.js";
import { parseFilePatch } from "../../../diff/domain/services/differ/index.js";
import { parseFileNumStat } from "../../../diff/domain/services/numstats.js";
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
  ): Promise<DiffEntry<DiffRepresentation>> {
    const rawPatch = await safeGit(
      this.gitRunner.getCommitfilePatch(repositoryPath, commitHash, filePath),
      this.eventEmitter,
    );

    const { hunks, diffRepresentation } = parseFilePatch(filePath, rawPatch);
    const rawNumStats = await safeGit(
      this.gitRunner.getCommitFileStats(repositoryPath, commitHash, filePath),
      this.eventEmitter,
    );
    let numstats: number[];
    if (rawNumStats.length >= 5) {
      numstats = parseFileNumStat(rawNumStats[4]);
    } else {
      numstats = [0, 0];
    }

    return {
      numStat: { added: numstats[0], removed: numstats[1] },
      representation: diffRepresentation,
      hunks,
    };
  }
}
