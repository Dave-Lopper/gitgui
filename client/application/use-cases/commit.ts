import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class Commit {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
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
    const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
    this.eventBus.emit({
      type: "RepositorySelected", 
      payload: dto,
    });
  }
}
