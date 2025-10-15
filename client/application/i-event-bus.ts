export type EventType = string;
export type Event = {
  type: EventType;
  payload?: any;
};
export type Subscriber = (event: Event) => void;

export interface IEventBus {
  subscribe(
    eventType: EventType,
    subscriber: Subscriber,
    getLastEvent?: boolean,
  ): void;
  unsubscribe(eventType: EventType, subscriber: Subscriber): void;
  emit(event: Event | Event[]): void;
}
