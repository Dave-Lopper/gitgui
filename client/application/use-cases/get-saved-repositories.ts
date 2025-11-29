import { IEventBus } from "../i-event-bus";
import { IRepositoryStore } from "../i-repository-store";

export class GetSavedRepositories {
  constructor(
    private readonly repositoryStore: IRepositoryStore,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(): Promise<void> {
    const repositories = await this.repositoryStore.getRepositories();
    await this.eventBus.emit({
      type: "SavedRepositoriesFetched",
      payload: repositories,
    });
  }
}
