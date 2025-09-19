import { DiffFile, getFilePath } from "../../domain/diff";
import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class ToggleFileStaged {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string, files: DiffFile[]): Promise<void> {
    await this.gitService.toggleFilesStaged(
      repositoryPath,
      files.map((file) => getFilePath(file)),
    );
    this.eventBus.emit({ type: "CurrentDiffUpdated", payload: null });
  }
}
