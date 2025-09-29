import { CommitStatus } from "../../domain/commit";
import { IEventBus } from "../i-event-bus";

export class RepositoryFetched {
  constructor(private readonly eventBus: IEventBus) {}

  execute(dto: CommitStatus): void {
    this.eventBus.emit({ type: "RepositoryFetched", payload: dto });
  }
}
