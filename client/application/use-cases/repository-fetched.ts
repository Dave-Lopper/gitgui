import { CommitStatus } from "../../domain/commit";
import { IEventBus } from "../i-event-bus";

export class RepositoryFetched {
  constructor(private readonly eventBus: IEventBus) {}

  async execute(dto: CommitStatus): Promise<void> {
    await this.eventBus.emit({ type: "RepositoryFetched", payload: dto });
  }
}
