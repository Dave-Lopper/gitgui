import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class SelectRepositoryFromSaved {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string): Promise<void> {
    const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
    await this.eventBus.emit({ type: "RepositorySelected", payload: dto });
  }
}
