import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { File } from "../../../diff/domain/entities.js";
import {
  parseFileDiff2,
  parseFileNumStat,
  parseStatus,
} from "../../../diff/domain/services.js";
// import { parseDiff } from "../../../diff/domain/services-2.js";
import { Commit } from "../../domain/entities.js";
import { parseCommitStatus, parseHistory } from "../../domain/services.js";
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
    // console.log({ logLines });
    const history = parseHistory(logLines);
    // console.log({ history });
    const commitsWithDiff: (Commit & { diff: File[] })[] = [];

    for (let i = 0; i < history.length; i++) {
      const commit = history[i];

      const rawCommitFiles = await this.gitRunner.getCommitFiles(
        repositoryPath,
        commit.hash,
      );
      console.log({ rawCommitFiles });
      const commitFiles = parseCommitStatus(rawCommitFiles);
      const commitFileDiffs = [];

      for (let j = 0; j < commitFiles.length; j++) {
        const commitFile = commitFiles[j];
        console.log(commitFile.path);
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
