import { safeGit } from "../../../server/commons/application/safe-git.js";
import { IEventBus } from "../i-event-bus.js";
import { IGitService } from "../i-git-service.js";

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
