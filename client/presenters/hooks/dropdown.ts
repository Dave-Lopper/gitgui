import {
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { UiSettingsContext } from "../contexts/ui-settings";
import { useSoundEffect } from "./sound-effect";

export function useDropdown() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const settings = useContext(UiSettingsContext);

  const maximizeSoundEffect = useSoundEffect("MAXIMIZE", settings.theme);
  const minimizeSoundEffect = useSoundEffect("MINIMIZE", settings.theme);

  const close = useCallback(() => {
    setIsExpanded(false);
    minimizeSoundEffect.play();
  }, [settings]);
  const open = useCallback(() => {
    setIsExpanded(true);
    maximizeSoundEffect.play();
  }, [settings]);
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
