import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { CommitStatusService } from "../../../commit/application/commit-status-service.js";
import { CommitStatusDto } from "../../../commit/dto/commit-status.js";
import { RepositoryGitRunner } from "../git-runner.js";

export class Fetch {
  constructor(
    private readonly commitStatusService: CommitStatusService,
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: RepositoryGitRunner,
  ) {}

  async execute(repositoryPath: string): Promise<CommitStatusDto> {
    await safeGit(this.gitRunner.fetch(repositoryPath), this.eventEmitter);
    const dto = await this.commitStatusService.execute(
      repositoryPath,
      this.eventEmitter,
    );
    return dto;
  }
}
