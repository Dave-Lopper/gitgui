import { createContext, Dispatch, SetStateAction } from "react";

import { Theme } from "../../themed/constants";

export type UiSettings = {
  theme: Theme;
  isSoundEnabled: boolean;

  setTheme: Dispatch<SetStateAction<Theme>>;
  setIsSoundEnabled: Dispatch<SetStateAction<boolean>>;
};

export const defaultSettings = {
  theme: "MODERN",
  isSoundEnabled: true,
} as const;

export const UiSettingsContext = createContext<UiSettings>({} as UiSettings);
