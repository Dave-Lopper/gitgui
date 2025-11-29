import { IEventBus } from "../i-event-bus";

export class EmptyDiffFilesSelection {
  constructor(private readonly eventBus: IEventBus) {}

  async execute(): Promise<void> {
    await this.eventBus.emit({
      type: "EmptyDiffFilesSelection",
    });
  }
}
