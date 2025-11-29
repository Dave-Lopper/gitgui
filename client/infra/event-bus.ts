import {
  Event,
  EventType,
  IEventBus,
  Subscriber,
} from "../application/i-event-bus";

export class ObservableEventBus implements IEventBus {
  private subscriptions: Map<EventType, Subscriber[]> = new Map();
  private lastEvents: Map<EventType, Event> = new Map();

  async emit(event: Event | Event[]): Promise<void> {
    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        this.lastEvents.set(event[i].type, event[i]);

        const subs = this.subscriptions.get(event[i].type);
        if (subs === undefined) {
          continue;
        }
        for (let j = 0; j < subs.length; j++) {
          await subs[j](event[i]);
        }
      }
    } else {
      this.lastEvents.set(event.type, event);

      const subs = this.subscriptions.get(event.type);
      if (subs === undefined) {
        return;
      }
      for (let i = 0; i < subs.length; i++) {
        await subs[i](event);
      }
    }
  }

  async subscribe(
    eventType: EventType,
    subscriber: Subscriber,
    getLastEvent: boolean = true,
  ): Promise<void> {
    const currentSubs = this.subscriptions.get(eventType);
    if (currentSubs === undefined) {
      this.subscriptions.set(eventType, [subscriber]);
    } else {
      this.subscriptions.set(eventType, [...currentSubs, subscriber]);
    }

    const lastEvent = this.lastEvents.get(eventType);
    if (lastEvent && getLastEvent) {
      await subscriber(lastEvent);
    }
  }

  unsubscribe(eventType: EventType, subscriber: Subscriber): void {
    const currentSubs = this.subscriptions.get(eventType);
    if (currentSubs === undefined) {
      return;
    }
    this.subscriptions.set(
      eventType,
      currentSubs.filter((sub) => sub !== subscriber),
    );
  }
}
