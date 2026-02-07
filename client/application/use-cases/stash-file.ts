import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class StashFile {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string, filePath: string): Promise<void> {
    await this.gitService.stashFile(repositoryPath, filePath);
    const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
    await this.eventBus.emit({
      type: "RepositorySelected",
      payload: dto,
    });
  }
}
