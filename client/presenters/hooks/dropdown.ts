import {
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { UiSettingsContext } from "../contexts/ui-settings/context";
import { useSoundEffect } from "./sound-effect";

export function useDropdown() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const { theme, isSoundEnabled } = useContext(UiSettingsContext);

  const maximizeSoundEffect = useSoundEffect("MAXIMIZE", theme);
  const minimizeSoundEffect = useSoundEffect("MINIMIZE", theme);

  const close = useCallback(() => {
    setIsExpanded(false);
    minimizeSoundEffect.play();
  }, [isSoundEnabled, theme]);
  const open = useCallback(() => {
    setIsExpanded(true);
    maximizeSoundEffect.play();
  }, [isSoundEnabled, theme]);
  const toggle = useCallback(() => {
    setIsExpanded((prev) => {
      if (prev === true) {
        minimizeSoundEffect.play();
      } else {
        maximizeSoundEffect.play();
      }

      return !prev;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          triggerRef.current?.focus();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (isFocused === true && !isExpanded) {
            open();
          } else if (isExpanded) {
            close();
          }
          break;
        case "Tab":
          close();
          break;
      }
      return null;
    },
    [isExpanded, isFocused, open, close],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded, close]);

  return {
    isFocused,
    isExpanded,
    dropdownRef,
    triggerRef,
    close,
    toggle,
    handleKeyDown,
    setIsFocused,
  };
}
