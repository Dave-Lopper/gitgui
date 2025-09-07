import { useEffect, useRef } from "react";

import { Dropdown as HeadlessDropdown } from "../../headless";
import RetroButton from "./Button";

function RetroRepositoryDropdownTrigger({
  isActive,
  isFocused,
}: {
  isActive: boolean;
  isFocused: boolean;
}) {
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
    <RetroButton isActive={isActive} ref={buttonRef} className="w-full">
      Select repository
    </RetroButton>
  );
}

export default function RetroRepositoryDropdown() {
  return (
    <HeadlessDropdown
      animate={false}
      children={
        <div className="font-retro retro-borders flex w-full items-center justify-center border-1 border-black text-black">
          Repo selection
        </div>
      }
      className="w-full"
      tabIndex={1}
      trigger={RetroRepositoryDropdownTrigger}
    ></HeadlessDropdown>
  );
}
