import { ReactNode } from "react";

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

export default function ModernRepositoryDropdown({
  repoSelectionMenu,
}: {
  repoSelectionMenu: ReactNode;
}) {
  return (
    <HeadlessDropdown
      animate
      className="w-full"
      closeEvent="RepositorySelected"
      tabIndex={1}
      trigger={ModernRepositoryDropdownTrigger}
    >
      {repoSelectionMenu}
    </HeadlessDropdown>
  );
}
