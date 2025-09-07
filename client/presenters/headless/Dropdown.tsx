import { ComponentType, ReactNode } from "react";

import { useDropdown } from "../hooks/dropdown";

export type DropdownProps = {
  animate: boolean;
  children: ReactNode;
  className?: string;
  tabIndex?: number;
  trigger: ComponentType<{ isActive: boolean; isFocused: boolean }>;
};

export default function Dropdown({
  animate,
  className,
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
    setIsFocused,
  } = useDropdown();

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block h-screen ${className}`}
    >
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
      >
        <Trigger isActive={isExpanded} isFocused={isFocused} />
      </div>
      <div
        className="absolute flex w-full"
        style={{
          transition: animate ? "transform 0.5s ease-in-out" : "unset",
          transform: `scaleY(${isExpanded ? 1 : 0})`,
          transformOrigin: "top",
          top: `${triggerRef.current?.offsetHeight}px`,
          height: `calc(100vh - ${triggerRef.current?.offsetHeight}px)`,
        }}
        role="menu"
      >
        {children}
      </div>
    </div>
  );
}
