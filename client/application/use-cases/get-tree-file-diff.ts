import { StatusEntry } from "../../domain/status";
import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class GetTreeFileDiff {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    repositoryPath: string,
    statusEntry: StatusEntry,
  ): Promise<void> {
    const diffEntry = await this.gitService.getTreeFileDiff(
      repositoryPath,
      statusEntry.path,
      statusEntry.staged,
    );
    await this.eventBus.emit({
      type: "FileDiffConsulted",
      payload: diffEntry,
    });
  }
}
