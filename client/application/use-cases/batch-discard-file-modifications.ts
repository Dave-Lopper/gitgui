import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class BatchDiscardFileModifications {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string, filePaths: string[]): Promise<void> {
    await this.gitService.batchDiscardFileModifications(
      repositoryPath,
      filePaths,
    );
    const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
    this.eventBus.emit({
      type: "RepositorySelected",
      payload: dto,
    });
  }
}
