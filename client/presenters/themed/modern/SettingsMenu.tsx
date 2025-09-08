import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { THEMES } from "../constants";
import { SounOffRetroIcon } from "../../../icons/retro";
import { UiSettingsContext } from "../../contexts/ui-settings/context";
import { SelectDropdown as HeadlessSelectDropdown } from "../../headless";
import { DropdownTriggerProps } from "../../headless/SelectDropdown";
import Switch from "./Switch";

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
      <Switch
        offChild={<p className="mx-2">Retro</p>}
        onChild={<p className="mr-2">Modern</p>}
        on={isThemeSwitchOn}
        onSwitch={() => {
          setIsThemeSwitchOn((prev) => !prev);
          setTimeout(
            () => setTheme((prev) => (prev === "MODERN" ? "RETRO" : "MODERN")),
            1000,
          );
        }}
        tabIndex={2}
      />
    </div>
  );
}
