export type EventChannel = "git:error" | "git:auth" | "repository:fetched";

export interface IEventEmitter {
  send(channel: EventChannel, payload?: unknown): void;
}
