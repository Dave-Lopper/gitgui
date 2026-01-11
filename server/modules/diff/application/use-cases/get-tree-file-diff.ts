import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffEntry, DiffRepresentation } from "../../domain/entities.js";
import { parseFilePatch } from "../../domain/services/differ/index.js";
import { parseFileNumStat } from "../../domain/services/numstats.js";
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
  ): Promise<DiffEntry<DiffRepresentation>> {
    const rawPatch = await safeGit(
      this.gitRunner.getFilePatch(repositoryPath, filePath, staged),
      this.eventEmitter,
    );
    const { hunks, diffRepresentation } = parseFilePatch(filePath, rawPatch);
    const numstatLines = await safeGit(
      this.gitRunner.getFileNumStats(repositoryPath, filePath, staged),
      this.eventEmitter,
    );
    const numstat = parseFileNumStat(numstatLines);
    console.log({ hunks, diffRepresentation });

    return {
      addedLines: numstat[0],
      removedLines: numstat[1],
      representation: diffRepresentation,
      hunks,
    };
  }
}
