import {
  Event,
  EventType,
  IEventBus,
  Subscriber,
} from "../application/i-event-bus";

export class EventBus implements IEventBus {
  private events: Map<EventType, Subscriber[]> = new Map();

  emit(event: Event): void {
    const subs = this.events.get(event.type);
    if (subs === undefined) {
      return;
    }
    for (let i = 0; i < subs.length; i++) {
      subs[i](event);
    }
  }

  subscribe(eventType: EventType, subscriber: Subscriber): void {
    const currentSubs = this.events.get(eventType);
    if (currentSubs === undefined) {
      this.events.set(eventType, [subscriber]);
    } else {
      this.events.set(eventType, [...currentSubs, subscriber]);
    }
  }

  unsubscribe(eventType: EventType, subscriber: Subscriber): void {
    const currentSubs = this.events.get(eventType);
    if (currentSubs === undefined) {
      return;
    }
    this.events.set(
      eventType,
      currentSubs.filter((sub) => sub !== subscriber),
    );
  }
}
