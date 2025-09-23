import { ReactNode } from "react";

import { Dropdown as HeadlessDropdown } from "../../headless";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";
import ModernDropdownTrigger from "./DropdownTrigger";
import { useRepositorySelection } from "../../headless/hooks/repository-selection";

function ModernRepositoryDropdownTrigger({
  isActive,
  isFocused,
}: DropdownTriggerProps) {
  const { repositorySelection } = useRepositorySelection();

  return (
    <ModernDropdownTrigger
      copy={
        repositorySelection ? (
          <div className="flex flex-col justify-center">
            <span className="text-left text-sm text-neutral-500">
              Current repository
            </span>
            <span className="text-md text-left text-white">
              {repositorySelection.repository.name}
            </span>
          </div>
        ) : (
          "Select repository"
        )
      }
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
      className="h-24 max-h-24 w-full"
      closeEvent="RepositorySelected"
      tabIndex={1}
      trigger={ModernRepositoryDropdownTrigger}
    >
      {repoSelectionMenu}
    </HeadlessDropdown>
  );
}
