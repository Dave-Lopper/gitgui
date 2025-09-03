import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class SelectRepositoryFromDisk {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string): Promise<void> {
    const dto = await this.gitService.selectRepoFromDisk(repositoryPath);
    this.eventBus.emit({ type: "RepositorySelected", payload: dto });
  }
}
