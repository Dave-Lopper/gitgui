import { BrowserWindow } from "electron";

import { DiffGitRunner } from "../git-runner.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffFile } from "../../domain/entities.js";
import { parseDiff } from "../../domain/services.js";

export class GetRepoDiff {
  constructor(private readonly gitRunner: DiffGitRunner) {}
  async execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<(DiffFile & { staged: boolean })[]> {
    const unstagedDiffLines = await safeGit(
      this.gitRunner.getRepoDiff(repositoryPath, false),
      window,
    );

    const unstagedChangedFiles = parseDiff(unstagedDiffLines);

    const stagedDiffLines = await safeGit(
      this.gitRunner.getRepoDiff(repositoryPath, true),
      window,
    );
    let stagedChangedFiles = parseDiff(stagedDiffLines);
    const unstagedFileNames = unstagedChangedFiles.map((file) =>
      file.displayPaths.join(","),
    );

    stagedChangedFiles = stagedChangedFiles.filter((file) => {
      const fileName = file.displayPaths.join(",");
      return !unstagedFileNames.includes(fileName);
    });

    const changedFiles = [...stagedChangedFiles, ...unstagedChangedFiles].map(
      (file) => ({ ...file, staged: stagedChangedFiles.includes(file) }),
    );

    return changedFiles.sort((a, b) =>
      a.displayPaths[0].localeCompare(b.displayPaths[0]),
    );
  }
}
