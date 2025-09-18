import { CurrentDiffFile, getFilePath } from "../../domain/diff";
import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class ToggleFileStaged {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(repositoryPath: string, file: CurrentDiffFile): Promise<void> {
    const files = await this.gitService.toggleFileStaged(
      repositoryPath,
      getFilePath(file),
      file.status,
    );
    this.eventBus.emit({ type: "CurrentDiffUpdated", payload: files });
  }
}
