import { ReactNode, useEffect, useRef } from "react";

import { Dropdown as HeadlessDropdown } from "../../headless";
import RetroButton from "./Button";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";

function RetroRepositoryDropdownTrigger({
  isActive,
  isFocused,
}: DropdownTriggerProps) {
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
      className="h-12 w-full px-8 py-2 font-bold"
    >
      Select repository
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
      children={repoSelectionMenu}
      className="w-full"
      closeEvent="RepositorySelected"
      tabIndex={0}
      trigger={RetroRepositoryDropdownTrigger}
    ></HeadlessDropdown>
  );
}
