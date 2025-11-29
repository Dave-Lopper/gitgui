import { IEventBus } from "../i-event-bus";

export class ExitViewedCommit {
  constructor(private readonly eventBus: IEventBus) {}

  async execute() {
    await this.eventBus.emit({
      type: "CommitViewed",
      payload: undefined,
    });
  }
}
