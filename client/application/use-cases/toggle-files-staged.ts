import { DiffFile, getFilePath } from "../../domain/diff";
import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class ToggleFilesStaged {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string, files: DiffFile[]): Promise<void> {
    console.log("USECASE", { repositoryPath });
    await this.gitService.toggleFilesStaged(
      repositoryPath,
      files.map((file) => getFilePath(file)),
    );
    const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
    this.eventBus.emit({ type: "RepositorySelected", payload: dto });
  }
}
