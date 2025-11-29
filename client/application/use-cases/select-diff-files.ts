import { StatusEntry } from "../../domain/status";
import { IEventBus } from "../i-event-bus";

export class SelectDiffFiles {
  constructor(private readonly eventBus: IEventBus) {}

  async execute(
    statusEntries: (StatusEntry & { index: number })[],
  ): Promise<void> {
    await this.eventBus.emit({
      type: "SelectDiffFiles",
      payload: statusEntries,
    });
  }
}
