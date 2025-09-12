import { KeyboardEvent, useCallback, useRef } from "react";

export function useFocusable(clickHandler: () => Promise<void>) {
  const ref = useRef<HTMLDivElement>(null);
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (!ref.current || e.key !== "Enter") {
        return;
      }
      if (ref.current === document.activeElement) {
        clickHandler();
      }
    },
    [ref.current],
  );

  return { ref, handleKeyDown };
}
