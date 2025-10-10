import { DiffFile, getFilePath } from "../../domain/diff";
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
    file: DiffFile,
    fileIndex: number,
    repositorySelection: RepositorySelectionDto,
  ): Promise<void> {
    await this.gitService.toggleFilesStaged(repositoryPath, [
      getFilePath(file),
    ]);
    const dto = await this.gitService.selectRepoFromSaved(repositoryPath);
    const previousStaging = repositorySelection.diff[fileIndex].staged;
    repositorySelection.diff[fileIndex].staged = !previousStaging;
    this.eventBus.emit({ type: "FileStaged", payload: dto });
  }
}
