import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { DiffFile } from "../../../diff/domain/entities.js";
import { parseDiff } from "../../../diff/domain/services.js";
import { Commit } from "../../domain/entities.js";
import { parseHistory } from "../../domain/services.js";
import { CommitGitRunner } from "../git-runner.js";

export class CommitUseCase {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: CommitGitRunner,
  ) {}

  async execute(
    repositoryPath: string,
    message: string,
    description?: string,
  ): Promise<Commit & { diff: DiffFile[] }> {
    const finalizedMessage = description
      ? `${message}\n\n${description}`
      : message;

    await safeGit(
      this.gitRunner.commit(repositoryPath, finalizedMessage),
      this.eventEmitter,
    );

    const commitHashes = await safeGit(
      this.gitRunner.getHeadHashes(repositoryPath),
      this.eventEmitter,
    );
    const commitDiffLines = await safeGit(
      this.gitRunner.getCommitDiff(repositoryPath, commitHashes.hash),
      this.eventEmitter,
    );
    const commitDiff = parseDiff(commitDiffLines);
    const historyLines = await safeGit(
      this.gitRunner.getHistory(repositoryPath, 1, 1),
      this.eventEmitter,
    );
    const commit = parseHistory(historyLines)[0];

    return { ...commit, diff: commitDiff };
  }
}
