import { ComponentType, KeyboardEvent } from "react";

import { useSelectDropdown } from "../hooks/select-dropdown";

type SelectableChild = (isSelected: boolean) => React.ReactNode;
type DropdownProps = {
  animate: boolean;
  children: SelectableChild[];
  handleSelect: (index: number | null) => void;
  trigger: ComponentType<{ isFocused: boolean }>;
};

export default function SelectDropdown({
  animate,
  children,
  handleSelect,
  trigger: Trigger,
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
  } = useSelectDropdown();

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLElement>) =>
    handleSelect(handleKeyDown(e, children.length));

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
          transition: animate ? "transform 0.5s ease-in-out" : "unset",
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
