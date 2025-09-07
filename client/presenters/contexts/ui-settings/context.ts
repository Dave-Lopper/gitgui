import { createContext, Dispatch, SetStateAction } from "react";

import { Theme } from "../../themed/constants";

export type UiSettings = {
  theme: Theme;
  isSoundEnabled: boolean;

  setTheme: (theme: Theme) => void;
  setIsSoundEnabled: Dispatch<SetStateAction<boolean>>;
};

export const defaultSettings = {
  theme: "RETRO",
  isSoundEnabled: false,
} as const;

export const UiSettingsContext = createContext<UiSettings>({} as UiSettings);
