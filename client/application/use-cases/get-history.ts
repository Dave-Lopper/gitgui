import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class GetCommitHistory {
  constructor(
    private readonly gitService: IGitService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    page: number,
    pageSize: number,
    repositoryPath: string,
  ): Promise<void> {
    const dto = await this.gitService.getHistory(
      page,
      pageSize,
      repositoryPath,
    );
    this.eventBus.emit({
      type: "CommitHistoryFetched",
      payload: dto,
    });
  }
}
