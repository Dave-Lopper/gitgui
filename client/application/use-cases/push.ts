import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class Push {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string): Promise<void> {
    await this.gitService.push(repositoryPath);
    this.eventBus.emit({ type: "Pushed", payload: {} });
  }
}
