import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class Fetch {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string): Promise<void> {
    const dto = await this.gitService.fetch(repositoryPath);
    this.eventBus.emit({ type: "RepositoryFetched", payload: dto });
  }
}
