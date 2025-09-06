import { ComponentType, ReactNode } from "react";

import { useDropdown } from "../hooks/dropdown";

type DropdownProps = {
  children: ReactNode;
  trigger: ComponentType<{ isFocused: boolean }>;
};

export default function Dropdown({
  trigger: Trigger,
  children,
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
    <div ref={dropdownRef} className="relative inline-block h-screen w-full">
      <div
        ref={triggerRef}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isExpanded}
      >
        <Trigger isFocused={isFocused} />
      </div>
      <div
      className="absolute flex w-full"
        style={{
          transition: "transform 0.5s ease-in-out",
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
