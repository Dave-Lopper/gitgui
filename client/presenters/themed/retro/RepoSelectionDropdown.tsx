import { ReactNode, useEffect, useRef } from "react";

import {
  Dropdown as HeadlessDropdown,
  useRepositorySelection,
} from "../../headless";
import RetroButton from "./Button";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";

function RetroRepositoryDropdownTrigger({
  isActive,
  isFocused,
}: DropdownTriggerProps) {
  const { repositorySelection } = useRepositorySelection();

  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!buttonRef.current) {
      return;
    }
    if (isFocused) {
      buttonRef.current.focus();
    } else {
      buttonRef.current.blur();
    }
  }, [isFocused]);

  return (
    <RetroButton
      isActive={isActive}
      ref={buttonRef}
      className="flex h-13 w-full flex-col justify-center px-8"
    >
      {repositorySelection ? (
        <>
          <span className="w-full text-left text-sm" style={{ lineHeight: "1" }}>
            Current repository
          </span>
          <span className="w-full text-left text-md/1 font-bold">
            {repositorySelection.repository.name}
          </span>
        </>
      ) : (
        "Select repository"
      )}
    </RetroButton>
  );
}

export default function RetroRepositoryDropdown({
  repoSelectionMenu,
}: {
  repoSelectionMenu: ReactNode;
}) {
  return (
    <HeadlessDropdown
      animate={false}
      className="w-full"
      closeEvent="RepositorySelected"
      tabIndex={0}
      trigger={RetroRepositoryDropdownTrigger}
    >
      {repoSelectionMenu}
    </HeadlessDropdown>
  );
}
