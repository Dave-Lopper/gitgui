import { StatusEntry } from "../../domain/status";
import { RepositorySelectionDto } from "../../dto/repo-selection";
import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class ToggleFileStaged {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    repositoryPath: string,
    file: StatusEntry,
    fileIndex: number,
    repositorySelection: RepositorySelectionDto,
  ): Promise<void> {
    await this.gitService.toggleFilesStaged(repositoryPath, [file.path]);
    const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
    const previousStaging =
      repositorySelection.treeStatus.entries[fileIndex].staged;
    repositorySelection.treeStatus.entries[fileIndex].staged = !previousStaging;
    this.eventBus.emit({ type: "FileStaged", payload: dto });
  }
}
