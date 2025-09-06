import { createContext } from "react";

import { Theme } from "../../application/theme";

export type UiSettings = {
  theme: Theme;
  isSoundEnabled: boolean;
};

export const defaultSettings: UiSettings = {
  theme: "MODERN",
  isSoundEnabled: false,
};

export const UiSettingsContext = createContext<UiSettings>(defaultSettings);
