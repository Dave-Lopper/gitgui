import { ComponentType, ReactNode } from "react";
import { set } from "zod";

import { EventType } from "../../application/i-event-bus";
import { useEventSubscription } from "../../infra/react-bus-helper";
import { useDropdown } from "./hooks/dropdown";

export type DropdownProps = {
  animate: boolean;
  children: ReactNode;
  className?: string;
  closeEvent?: EventType;
  tabIndex?: number;
  trigger: ComponentType<{ isActive: boolean; isFocused: boolean }>;
};

export default function Dropdown({
  animate,
  className,
  closeEvent,
  children,
  tabIndex,
  trigger: Trigger,
}: DropdownProps) {
  const {
    isExpanded,
    isFocused,
    dropdownRef,
    triggerRef,
    toggle,
    handleKeyDown,
    setIsExpanded,
    setIsFocused,
  } = useDropdown();

  if (closeEvent) {
    useEventSubscription(closeEvent, async () => setIsExpanded(false), []);
  }

  return (
    <div ref={dropdownRef} className={`${className} focus:outline-none`}>
      <div
        ref={triggerRef}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={tabIndex || 0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isExpanded}
        className="focus:outline-none"
      >
        <Trigger isActive={isExpanded} isFocused={isFocused} />
      </div>
      <div
        className="flex w-full flex-col"
        style={{
          transition: animate ? "transform 0.5s ease-in-out" : "unset",
          transform: `scaleY(${isExpanded ? 1 : 0})`,
          transformOrigin: "top",
          position: "relative",
          height: `calc(100vh - ${triggerRef.current?.offsetHeight}px)`,
          zIndex: "99",
        }}
        role="menu"
      >
        {children}
      </div>
    </div>
  );
}
