import { ComponentType, KeyboardEvent } from "react";

import { useDropdown } from "../hooks/dropdown";

type SelectableChild = (isSelected: boolean) => React.ReactNode;
type DropdownProps = {
  children: SelectableChild[];
  trigger: ComponentType<{ isFocused: boolean }>;
};

export default function Dropdown({
  trigger: Trigger,
  children,
}: DropdownProps) {
  const {
    isExpanded,
    isFocused,
    selectedIndex,
    dropdownRef,
    triggerRef,
    toggle,
    handleKeyDown,
    setIsFocused,
  } = useDropdown();

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const result = handleKeyDown(e, children.length);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block w-full">
      <div
        ref={triggerRef}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
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
        style={{
          transition: "transform 0.5s ease-in-out",
          transform: `scaleY(${isExpanded ? 1 : 0})`,
          transformOrigin: "top",
        }}
        role="menu"
      >
        {children.map((child, index) => child(index === selectedIndex))}
      </div>
    </div>
  );
}
