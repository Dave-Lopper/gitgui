import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffFile } from "../../domain/entities.js";
import {
  parseDiff,
  parseNewFileDiff,
  parseStatus,
} from "../../domain/services.js";
import { DiffGitRunner } from "../git-runner.js";

export class GetRepoDiff {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: DiffGitRunner,
  ) {}
  async execute(
    repositoryPath: string,
  ): Promise<(DiffFile & { staged: boolean })[]> {
    const unstagedDiffLines = await safeGit(
      this.gitRunner.getRepoDiff(repositoryPath, false),
      this.eventEmitter,
    );
    // console.log({ unstagedDiffLines });
    const unstagedChangedFiles = parseDiff(unstagedDiffLines);

    const stagedDiffLines = await safeGit(
      this.gitRunner.getRepoDiff(repositoryPath, true),
      this.eventEmitter,
    );
    let stagedChangedFiles = parseDiff(stagedDiffLines);
    const unstagedFileNames = unstagedChangedFiles.map((file) =>
      file.displayPaths.join(","),
    );
    stagedChangedFiles = stagedChangedFiles.filter((file) => {
      const fileName = file.displayPaths.join(",");
      return !unstagedFileNames.includes(fileName);
    });

    const repoStatusLines = await this.gitRunner.getRepoStatus(repositoryPath);
    const addedFiles = parseStatus(repoStatusLines);
    const addedFileDiffs = [];

    for (let i = 0; i < addedFiles.length; i++) {
      const addedFileDiffLines = await this.gitRunner.getAddedFileDiff(
        repositoryPath,
        addedFiles[i],
      );
      addedFileDiffs.push(parseNewFileDiff(addedFileDiffLines));
    }

    const changedFiles = [
      ...stagedChangedFiles,
      ...unstagedChangedFiles,
      ...addedFileDiffs,
    ].map((file) => ({ ...file, staged: stagedChangedFiles.includes(file) }));

    return changedFiles.sort((a, b) =>
      a.displayPaths[0].localeCompare(b.displayPaths[0]),
    );
  }
}
