import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { StatusEntry } from "../../../status/domain/entities.js";
import { parseCommitStatus } from "../../../status/domain/services.js";
import { CommitGitRunner } from "../git-runner.js";

export class GetCommitStatus {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: CommitGitRunner,
  ) {}

  async execute(
    repositoryPath: string,
    commitHash: string,
  ): Promise<StatusEntry[]> {
    const statusLines = await safeGit(
      this.gitRunner.getCommitFiles(repositoryPath, commitHash),
      this.eventEmitter,
    );
    return parseCommitStatus(statusLines.slice(4));
  }
}
