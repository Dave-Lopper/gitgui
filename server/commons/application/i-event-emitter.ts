export interface IEventEmitter {
  send(channel: string, payload: unknown): void;
}
