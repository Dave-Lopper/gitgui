import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { File } from "../../../diff/domain/entities.js";
import { parseFileNumStat } from "../../../diff/domain/services.js";
import { CommitStatusService } from "../../../status/application/services/commit-status.js";
import { Commit } from "../../domain/entities.js";
import { parseHistory } from "../../domain/services.js";
import { HistoryPaginationDto } from "../../dto/history-pagination.js";
import { CommitGitRunner } from "../git-runner.js";

export class GetHistory {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: CommitGitRunner,
    private readonly commitStatusService: CommitStatusService,
  ) {}

  async execute(
    page: number,
    pageSize: number,
    repositoryPath: string,
  ): Promise<HistoryPaginationDto> {
    if (pageSize === 0) {
      throw new Error("Get history can't be called with page size of 0");
    }

    const commitsCountLines = await safeGit(
      this.gitRunner.getCommitsCount(repositoryPath),
      this.eventEmitter,
    );
    const commitsCount = parseInt(commitsCountLines[0].trim());
    const totalPages = Math.ceil(commitsCount / pageSize);

    if (page > totalPages) {
      console.warn(
        `Queried unexisting history page ${page} with pageSize of ${pageSize}`,
      );
      return { page, pageSize, hasNextPage: false, history: [], totalPages };
    }

    const logLines = await safeGit(
      this.gitRunner.getHistory(repositoryPath, page, pageSize),
      this.eventEmitter,
    );
    const history = parseHistory(logLines);
    const commitsWithDiff: (Commit & { diff: File[] })[] = [];

    for (let i = 0; i < history.length; i++) {
      const commit = history[i];

      const commitFiles = await this.commitStatusService.execute(
        repositoryPath,
        commit.hash,
      );
      const commitFileDiffs = [];

      for (let j = 0; j < commitFiles.length; j++) {
        const commitFile = commitFiles[j];
        const rawCommitFileDiff = await this.gitRunner.getCommitFileDiff(
          repositoryPath,
          commit.hash,
          commitFile.path,
        );
        const rawCommitFileStats = await this.gitRunner.getCommitFileStats(
          repositoryPath,
          commit.hash,
          commitFile.path,
        );
        const commitFileStats = parseFileNumStat(rawCommitFileStats);

        // commitFileDiffs.push(
        //   parseFileDiff2(rawCommitFileDiff, { ...commitFile }),
        // );
      }
      if (i === 1) {
        break;
      }
      // const commitDiffFiles = parseDiff(commitDiffLines.slice(6).join("\n"));
      // commitsWithDiff.push({ ...commit, diff: commitDiffFiles });
    }

    return {
      hasNextPage: page < totalPages,
      history: commitsWithDiff,
      page,
      pageSize,
      totalPages,
    };
  }
}
