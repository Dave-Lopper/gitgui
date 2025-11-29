import { useEffect } from "react";

import { EventType, Subscriber } from "../application/i-event-bus";
import { eventBus } from "../bootstrap";

export function useEventSubscription(
  event: EventType | EventType[],
  subscriber: Subscriber,
  dependencies: any[] | undefined,
  getLastEvent: boolean = true,
) {
  useEffect(() => {
    const subscribe = async (
      event: string,
      subscriber: Subscriber,
      getLastEvent: boolean,
    ) => {
      await eventBus.subscribe(event, subscriber, getLastEvent);
    };

    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        subscribe(event[i], subscriber, getLastEvent);
      }
    } else {
      subscribe(event, subscriber, getLastEvent);
    }

    return () => {
      if (Array.isArray(event)) {
        for (let i = 0; i < event.length; i++) {
          eventBus.unsubscribe(event[i], subscriber);
        }
      } else {
        eventBus.unsubscribe(event, subscriber);
      }
    };
  }, dependencies);
}
