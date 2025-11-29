export type EventType = string;
export type Event = {
  type: EventType;
  payload?: any;
};
export type Subscriber = (event: Event) => Promise<void>;

export interface IEventBus {
  subscribe(
    eventType: EventType,
    subscriber: Subscriber,
    getLastEvent?: boolean,
  ): Promise<void>;
  unsubscribe(eventType: EventType, subscriber: Subscriber): void;
  emit(event: Event | Event[]): Promise<void>;
}
