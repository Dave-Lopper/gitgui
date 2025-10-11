import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffFile } from "../../../diff/domain/entities.js";
import { parseDiff } from "../../../diff/domain/services.js";
import { Commit } from "../../domain/entities.js";
import { parseHistory } from "../../domain/services.js";
import { HistoryPaginationDto } from "../../dto/history-pagination.js";
import { CommitGitRunner } from "../git-runner.js";

export class GetHistory {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: CommitGitRunner,
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
    const commitsWithDiff: (Commit & { diff: DiffFile[] })[] = [];

    for (let i = 0; i < history.length; i++) {
      const commit = history[i];

      const commitDiffLines = await this.gitRunner.getCommitDiff(
        repositoryPath,
        commit.hash,
      );
      const commitDiffFiles = parseDiff(commitDiffLines.slice(6));
      commitsWithDiff.push({ ...commit, diff: commitDiffFiles });
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
