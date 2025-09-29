import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class Pull {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string): Promise<void> {
    await this.gitService.pull(repositoryPath);
    this.eventBus.emit({ type: "Pulled", payload: {} });
  }
}
