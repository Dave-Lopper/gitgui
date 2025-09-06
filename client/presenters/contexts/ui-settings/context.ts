import { createContext } from "react";

import { Theme } from "../../../application/theme";

export type UiSettings = {
  theme: Theme;
  isSoundEnabled: boolean;

  setTheme: (theme: Theme) => void;
  setIsSoundEnabled: (isSoundEnabled: boolean) => void;
};

export const defaultSettings = {
  theme: "MODERN",
  isSoundEnabled: false,
} as const;

export const UiSettingsContext = createContext<UiSettings>({} as UiSettings);
