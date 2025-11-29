import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class CloneRepository {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(url: string): Promise<void> {
    const dto = await this.gitService.clone(url);
    await this .eventBus.emit({ type: "RepositoryCloned", payload: dto });
  }
}
