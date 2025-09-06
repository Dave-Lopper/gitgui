import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

export function useDropdown() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsExpanded(false);
    setSelectedIndex(-1);
  }, []);
  const toggle = useCallback(() => setIsExpanded((prev) => !prev), []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>, itemCount: number) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          close();
          triggerRef.current?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          if (isExpanded) {
            setSelectedIndex((prev) => (prev + 1) % itemCount);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isExpanded) {
            setSelectedIndex((prev) => (prev - 1 + itemCount) % itemCount);
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (isFocused === true && !isExpanded) {
            setIsExpanded(true);
          } else if (isExpanded && selectedIndex >= 0) {
            close();
            return selectedIndex;
          }
          break;
        case "Tab":
          close();
          break;
      }
      return null;
    },
    [isExpanded, isFocused, selectedIndex, open, close],
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
    selectedIndex,
    dropdownRef,
    triggerRef,
    close,
    toggle,
    handleKeyDown,
    setIsFocused,
    setSelectedIndex,
  };
}
