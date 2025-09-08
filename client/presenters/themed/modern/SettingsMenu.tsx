import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { THEMES } from "../constants";
import { SounOffRetroIcon } from "../../../icons/retro";
import { UiSettingsContext } from "../../contexts/ui-settings/context";
import { SelectDropdown as HeadlessSelectDropdown } from "../../headless";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";
import Switch from "./Switch";
import {
  FlatScreenIcon,
  OldScreenIcon,
  SoundOffModernIcon,
  SoundOnModernIcon,
} from "../../../icons/modern";

export default function ModernSettingsMenu() {
  const { isSoundEnabled, setIsSoundEnabled, setTheme, theme } =
    useContext(UiSettingsContext);

  const [isThemeSwitchOn, setIsThemeSwitchOn] = useState(theme === "MODERN");

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
      className="font-modern bg-modern-dark-pri border-modern-dark-border flex h-24 items-center justify-end border-1 border-b-1"
      style={{ borderBottom: "1px solid #404040" }}
    >
      <div className="flex h-full flex-col justify-between py-4">
        <Switch
          offChild={
            <span className="relative bottom-[3px] mx-4">
              <OldScreenIcon color="white" size={22} />
            </span>
          }
          onChild={
            <span className="mr-4">
              <FlatScreenIcon color="white" size={20} />
            </span>
          }
          on={isThemeSwitchOn}
          onSwitch={() => {
            setIsThemeSwitchOn((prev) => !prev);
            setTimeout(
              () =>
                setTheme((prev) => (prev === "MODERN" ? "RETRO" : "MODERN")),
              1000,
            );
          }}
          tabIndex={2}
        />
        <Switch
          offChild={
            <span className="relative bottom-[3px] mx-4">
              <SoundOffModernIcon color="white" size={22} />
            </span>
          }
          onChild={
            <span className="mr-4">
              <SoundOnModernIcon color="white" size={20} />
            </span>
          }
          on={isSoundEnabled}
          onSwitch={() => setIsSoundEnabled((prev) => !prev)}
          tabIndex={3}
        />
      </div>
    </div>
  );
}
