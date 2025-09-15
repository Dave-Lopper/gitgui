import { KeyboardEvent, useCallback, useRef } from "react";

export function useFocusable(handler: () => Promise<void>) {
  const ref = useRef<HTMLDivElement>(null);
  const handleKeyDown = useCallback(
    async (e: KeyboardEvent<HTMLElement>) => {
      if (!ref.current || e.key !== "Enter") {
        return;
      }
      if (ref.current === document.activeElement) {
        await handler();
      }
    },
    [ref.current],
  );

  return { ref, handleKeyDown };
}
