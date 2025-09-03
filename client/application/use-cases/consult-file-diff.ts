import { IEventBus } from "../i-event-bus";

export class ConsultFileDiff {
  constructor(private readonly eventBus: IEventBus) {}

  async execute(filePath: string): Promise<void> {
    this.eventBus.emit({ type: "FileDiffConsulted", payload: filePath });
  }
}
