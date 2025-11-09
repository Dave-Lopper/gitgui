import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { RepoStatusService } from "../../../status/application/services/repo-status.js";
import { TreeStatus } from "../../../status/domain/entities.js";
import { RepositoryGitRunner } from "../git-runner.js";

export class Fetch {
  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly gitRunner: RepositoryGitRunner,
    private readonly repoStatusService: RepoStatusService,
  ) {}

  async execute(repositoryPath: string): Promise<TreeStatus> {
    await safeGit(this.gitRunner.fetch(repositoryPath), this.eventEmitter);
    return await this.repoStatusService.execute(repositoryPath);
  }
}
