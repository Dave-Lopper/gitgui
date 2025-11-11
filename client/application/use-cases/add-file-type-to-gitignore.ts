import { StatusEntry } from "../../domain/status";
import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class AddFileTypeToGitignore {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string, file: StatusEntry): Promise<void> {
    const pathParts = file.path.split(".");
    const extension = pathParts[pathParts.length - 1];
    await this.gitService.batchAddToGitignore(repositoryPath, extension);
    const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
    this.eventBus.emit({
      type: "RepositorySelected",
      payload: dto,
    });
  }
}
