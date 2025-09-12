import {
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { UiSettingsContext } from "../../contexts/ui-settings/context";
import { useSoundEffect } from "./sound-effect";

export function useDropdown() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const { theme, isSoundEnabled } = useContext(UiSettingsContext);

  const maximizeSoundEffect = useSoundEffect("MAXIMIZE");
  const minimizeSoundEffect = useSoundEffect("MINIMIZE");

  const collapse = useCallback(() => {
    setIsExpanded(false);
    minimizeSoundEffect.play();
  }, [isSoundEnabled, theme]);
  const expand = useCallback(() => {
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
  }, [isSoundEnabled]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          collapse();
          triggerRef.current?.focus();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (isFocused === true && !isExpanded) {
            expand();
          } else if (isExpanded) {
            collapse();
          }
          break;
      }
      return null;
    },
    [isExpanded, isFocused, expand, collapse],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        collapse();
      }
    }

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded, collapse]);

  return {
    isFocused,
    isExpanded,
    dropdownRef,
    triggerRef,
    collapse,
    toggle,
    handleKeyDown,
    setIsFocused,
    setIsExpanded,
  };
}
