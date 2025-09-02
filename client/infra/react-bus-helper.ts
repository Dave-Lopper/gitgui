import { useEffect } from "react";

import { EventType, Subscriber } from "../application/i-event-bus";
import { eventBus } from "../bootstrap";

export function useEventSubscription(
  event: EventType | EventType[],
  subscriber: Subscriber,
  dependencies: any[],
) {
  useEffect(() => {
    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        eventBus.subscribe(event[i], subscriber);
      }
    } else {
      eventBus.subscribe(event, subscriber);
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
