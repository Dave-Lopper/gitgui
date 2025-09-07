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

export function useSelectDropdown() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const { theme, isSoundEnabled } = useContext(UiSettingsContext);
  const maximizeSoundEffect = useSoundEffect("MAXIMIZE");
  const minimizeSoundEffect = useSoundEffect("MINIMIZE");

  const collapse = useCallback(() => {
    setIsExpanded(false);
    setSelectedIndex(-1);
    minimizeSoundEffect.play();
  }, [isSoundEnabled, theme]);

  const expand = useCallback(() => {
    setIsExpanded(true);
    maximizeSoundEffect.play();
  }, [isSoundEnabled, theme]);

  const toggle = useCallback(() => {
    setIsExpanded((prev) => {
      if (prev === true) {
        setSelectedIndex(-1);
        minimizeSoundEffect.play();
      } else {
        maximizeSoundEffect.play();
      }

      return !prev;
    });
  }, [isSoundEnabled]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>, itemsCount: number) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          if (isExpanded) {
            collapse();
            triggerRef.current?.focus();
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (isFocused === true && !isExpanded) {
            expand();
          } else if (isExpanded) {
            collapse();
            if (selectedIndex !== -1) {
              return selectedIndex;
            }
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (isFocused && !isExpanded) {
            expand();
          } else if (isExpanded) {
            setSelectedIndex((prev) => (prev + 1) % itemsCount);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isExpanded) {
            setSelectedIndex((prev) => (prev - 1) % itemsCount);
          }
          break;
        case "Tab":
          collapse();
          triggerRef.current?.blur();
          break;
      }
      return null;
    },
    [isExpanded, isFocused, selectedIndex, expand, collapse],
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
    selectedIndex,
    dropdownRef,
    triggerRef,
    collapse,
    toggle,
    handleKeyDown,
    setIsFocused,
  };
}
