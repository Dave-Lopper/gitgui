import { Commit } from "../../domain/commit.js";
import { IEventBus } from "../i-event-bus.js";
import { IGitService } from "../i-git-service.js";

export class ViewCommit {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly gitService: IGitService,
  ) {}

  async execute(
    repositoryPath: string,
    commit: Commit | undefined,
  ): Promise<void> {
    if (commit) {
      const status = await this.gitService.getCommitStatus(
        repositoryPath,
        commit?.hash,
      );
      await this.eventBus.emit({
        type: "CommitViewed",
        payload: { commit, status },
      });
    } else {
      await this.eventBus.emit({
        type: "CommitViewed",
        payload: undefined,
      });
    }
  }
}
