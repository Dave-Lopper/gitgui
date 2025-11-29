import { StatusEntry } from "../../domain/status";
import { IEventBus } from "../i-event-bus";

export class ToggleDiffFileSelection {
  constructor(private readonly eventBus: IEventBus) {}

  async execute(statusEntry: StatusEntry & { index: number }): Promise<void> {
    await this.eventBus.emit({
      type: "FileDiffSelectionToggles",
      payload: statusEntry,
    });
  }
}
