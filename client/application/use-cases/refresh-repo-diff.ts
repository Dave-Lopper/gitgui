import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class RefreshRepoDiff {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(): Promise<void> {
    const dto = await this.gitService.selectRepoFromDisk();
    this.eventBus.emit({ type: "RepositorySelected", payload: dto });
  }
}
