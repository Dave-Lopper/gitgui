import { StatusEntry } from "../../domain/status";
import { IEventBus } from "../i-event-bus";

export class SelectDiffFile {
  constructor(private readonly eventBus: IEventBus) {}

  async execute(statusEntry: StatusEntry & { index: number }): Promise<void> {
    await this.eventBus.emit({
      type: "SelectDiffFile",
      payload: statusEntry,
    });
  }
}
