import { IEventBus } from "../i-event-bus";

export class ConsultCommitDiff {
  constructor(private readonly eventBus: IEventBus) {}

  async execute(hash: string): Promise<void> {
    await this.eventBus.emit({ type: "CommitDiffConsulted", payload: hash });
  }
}
