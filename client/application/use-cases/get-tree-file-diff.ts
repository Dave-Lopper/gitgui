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
    remoteName: string,
    statusEntry: StatusEntry,
    currentBranchName: string,
  ): Promise<void> {
    const diffEntry = await this.gitService.getTreeFileDiff(
      repositoryPath,
      statusEntry.path,
      currentBranchName,
      remoteName,
      statusEntry.staged,
      statusEntry.status,
    );
    await this.eventBus.emit({
      type: "FileDiffConsulted",
      payload: diffEntry,
    });
  }
}
