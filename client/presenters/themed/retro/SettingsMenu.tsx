import { useCallback, useContext, useEffect, useRef } from "react";

import { THEMES } from "../constants";
import { SounOffRetroIcon } from "../../../icons/retro";
import { UiSettingsContext } from "../../contexts/ui-settings/context";
import { SelectDropdown as HeadlessSelectDropdown } from "../../headless";
import RetroButton from "./Button";

function ThemeDropdownTrigger({
  isActive,
  isFocused,
}: {
  isActive: boolean;
  isFocused: boolean;
}) {
  const { theme } = useContext(UiSettingsContext);
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
    <RetroButton isActive={isActive} ref={buttonRef} className="w-full px-6">
      Theme ({theme})
    </RetroButton>
  );
}

export default function RetroSettingsMenu() {
  const { isSoundEnabled, setIsSoundEnabled, setTheme, theme } =
    useContext(UiSettingsContext);

  const handleThemeSelection = useCallback(
    (value: number | null) => {
      if (value !== null) {
        setTheme(THEMES[value]);
      }
    },
    [THEMES],
  );

  return (
    <div
      className="flex h-12 justify-end"
      style={{ borderBottom: "1px solid #404040" }}
    >
      <HeadlessSelectDropdown
        animate={false}
        handleSelect={handleThemeSelection}
        children={THEMES.map((option) => (isSelected: boolean) => (
          <div
            key={option}
            className={`${isSelected || theme === option ? "bg-retro-active text-white" : "bg-white"} hover:bg-retro-pressed flex h-8 cursor-pointer items-center justify-center text-black`}
          >
            {option.charAt(0) + option.slice(1).toLowerCase()}
          </div>
        ))}
        className="w-full"
        tabIndex={2}
        trigger={ThemeDropdownTrigger}
      ></HeadlessSelectDropdown>
      <RetroButton
        isActive={!isSoundEnabled}
        onClick={() => setIsSoundEnabled((prev) => !prev)}
        className="px-2"
      >
        <SounOffRetroIcon />
      </RetroButton>
    </div>
  );
}
