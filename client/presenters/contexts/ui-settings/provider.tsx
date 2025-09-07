import { ReactNode, useState } from "react";

import { defaultSettings, UiSettingsContext } from "./context";
import { Theme } from "../../themed/constants";

export function UiSettingsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(defaultSettings.theme);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(
    defaultSettings.isSoundEnabled,
  );

  return (
    <UiSettingsContext.Provider
      value={{ theme, setTheme, isSoundEnabled, setIsSoundEnabled }}
    >
      {children}
    </UiSettingsContext.Provider>
  );
}
