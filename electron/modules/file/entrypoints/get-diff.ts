import { BrowserWindow } from "electron";

import { GitRunner } from "../../repository/application/git-runner.js";
import { ActionResponse } from "../../../commons/action.js";
import { safeGit } from "../../../commons/safe-git.js";
import { FileDiff, parseDiff } from "../domain.js";

export class GetDiff {
  constructor(private readonly gitRunner: GitRunner) {}
  async execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<(FileDiff & { staged: boolean })[]> {
    const unstagedDiffLines = await safeGit(
      this.gitRunner.getRepoDiff(repositoryPath, false),
      window,
    );
    const unstagedChangedFiles = parseDiff(unstagedDiffLines);
    const stagedDiffLines = await safeGit(
      this.gitRunner.getRepoDiff(repositoryPath, true),
      window,
    );
    const stagedChangedFiles = parseDiff(stagedDiffLines);

    const changedFiles = [...stagedChangedFiles, ...unstagedChangedFiles].map(
      (file) => ({ ...file, staged: stagedChangedFiles.includes(file) }),
    );

    return changedFiles;
  }
}
