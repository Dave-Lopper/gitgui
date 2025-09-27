import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class Commit {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly gitService: IGitService,
  ) {}

  async execute(
    repositoryPath: string,
    commitMessage: string,
    commitDescription?: string,
  ): Promise<void> {
    const commit = await this.gitService.commit(
      repositoryPath,
      commitMessage,
      commitDescription,
    );
    this.eventBus.emit({ type: "Commited", payload: commit });
  }
}
