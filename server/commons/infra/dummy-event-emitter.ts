import { EventChannel, IEventEmitter } from "../application/i-event-emitter";

export class DummyEventEmitter implements IEventEmitter {
  send(channel: EventChannel, payload?: unknown): void {
    return;
  }
}
