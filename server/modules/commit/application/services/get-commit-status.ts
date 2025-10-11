import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { parseCommitStatus } from "../../domain/services.js";
import { CommitStatusDto } from "../../dto/commit-status.js";
import { CommitGitRunner } from "../git-runner.js";

export class GetCommitStatus {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: CommitGitRunner,
  ) {}
  async execute(repositoryPath: string): Promise<CommitStatusDto> {
    const commitStatusLines = await safeGit(
      this.gitRunner.getCommitStatus(repositoryPath),
      this.eventEmitter,
    );
    return parseCommitStatus(commitStatusLines);
  }
}
