import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { StatusEntry } from "../../domain/entities";
import { parseRepoStatus } from "../../domain/services.js";
import { GitStatusRunner } from "../git-runner.js";

export class CommitStatusService {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: GitStatusRunner,
  ) {}

  async execute(
    repositoryPath: string,
    commitHash: string,
  ): Promise<StatusEntry[]> {
    const statusLines = await safeGit(
      this.gitRunner.getCommitStatus(repositoryPath, commitHash),
      this.eventEmitter,
    );
    const statusEntries = parseRepoStatus(statusLines);
    return statusEntries;
  }
}
