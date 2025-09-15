import { ComponentType, KeyboardEvent, useRef } from "react";

import { useSelectDropdown } from "./hooks/select-dropdown";

type SelectableChild = (isSelected: boolean) => React.ReactNode;
export type DropdownTriggerProps = { isActive: boolean; isFocused: boolean };
export type SelectDropdownProps<TriggerExtraProps = {}> = {
  animate: boolean;
  children: SelectableChild[];
  className?: string;
  handleSelect: (index: number | null) => void;
  selectClassName?: string;
  tabIndex?: number;
  trigger: ComponentType<DropdownTriggerProps & TriggerExtraProps>;
} & TriggerExtraProps;

export default function SelectDropdown<TriggerExtraProps = {}>({
  animate,
  children,
  className,
  handleSelect,
  selectClassName,
  tabIndex,
  trigger: Trigger,
  ...triggerExtraProps
}: SelectDropdownProps<TriggerExtraProps>) {
  const {
    collapse,
    isExpanded,
    isFocused,
    selectedIndex,
    dropdownRef,
    triggerRef,
    toggle,
    handleKeyDown,
    setIsFocused,
    setSelectedIndex,
  } = useSelectDropdown();

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLElement>) =>
    handleSelect(handleKeyDown(e, children.length));

  console.log({ animate });

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block w-full ${className}`}
    >
      <div
        ref={triggerRef}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-haspopup="true"
        aria-expanded={isExpanded}
      >
        <Trigger
          isActive={isExpanded}
          isFocused={isFocused}
          {...(triggerExtraProps as TriggerExtraProps)}
        />
      </div>

      <div
        className={`${selectClassName ? selectClassName : ""}`}
        style={{
          transition: animate ? "transform 0.5s ease-in-out" : "unset",
          transform: `scaleY(${isExpanded ? 1 : 0})`,
          transformOrigin: "top",
          height: `calc(100vh - ${triggerRef.current?.offsetHeight}px)`,
          overflow: "auto",
        }}
        role="menu"
      >
        {children.map((child, index) => (
          <span
            onClick={() => {
              setSelectedIndex(index);
              handleSelect(index);
              collapse();
            }}
          >
            {child(index === selectedIndex)}
          </span>
        ))}
      </div>
    </div>
  );
}
