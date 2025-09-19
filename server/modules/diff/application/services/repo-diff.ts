import * as fs from "fs";
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
    fs.writeFileSync("diff.log", unstagedDiffLines.join("\n"));

    const unstagedChangedFiles = parseDiff(unstagedDiffLines);

    const stagedDiffLines = await safeGit(
      this.gitRunner.getRepoDiff(repositoryPath, true),
      window,
    );
    const stagedChangedFiles = parseDiff(stagedDiffLines);

    const changedFiles = [...stagedChangedFiles, ...unstagedChangedFiles].map(
      (file) => ({ ...file, staged: stagedChangedFiles.includes(file) }),
    );

    return changedFiles.sort((a, b) =>
      a.displayPaths[0].localeCompare(b.displayPaths[0]),
    );
  }
}
