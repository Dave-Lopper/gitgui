import { ReactNode } from "react";

import { DropdownTriggerProps } from "../../headless/SelectDropdown";
import { ChevronModernIcon } from "../../../icons/modern";

export default function ModernDropdownTrigger({
  copy,
  isActive,
  isFocused,
}: DropdownTriggerProps & { copy: ReactNode }) {
  return (
    <div
      role="button"
      className={`font-modern bg-modern-dark-pri border-modern-dark-border flex h-24 max-h-24 w-full cursor-pointer items-center justify-between border-1 border-b-1 px-12 font-bold text-white focus:outline-none ${isFocused ? "outline-2 outline-offset-0 outline-sky-500 outline-solid" : ""}`}
    >
      {copy}
      <span
        className="ml-4"
        style={{
          transition: "transform 0.3s ease-in-out",
          transform: `rotate(${isActive ? "0deg" : "180deg"})`,
        }}
      >
        <ChevronModernIcon color="#ffffff" size={14} />
      </span>
    </div>
  );
}
