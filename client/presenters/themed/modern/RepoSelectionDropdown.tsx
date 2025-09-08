import { ChevronModernIcon } from "../../../icons/modern";
import { Dropdown as HeadlessDropdown } from "../../headless";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";
import ModernDropdownTrigger from "./DropdownTrigger";

function ModernRepositoryDropdownTrigger({
  isActive,
  isFocused,
}: DropdownTriggerProps) {
  return (
    <ModernDropdownTrigger
      copy="Select repository"
      isActive={isActive}
      isFocused={isFocused}
    />
  );
}

export default function ModernRepositoryDropdown() {
  return (
    <HeadlessDropdown
      animate
      children={
        <div className="font-modern bg-modern-dark-sec flex w-full items-center justify-center text-white">
          Repo selection
        </div>
      }
      className="w-full"
      tabIndex={1}
      trigger={ModernRepositoryDropdownTrigger}
    ></HeadlessDropdown>
  );
}
