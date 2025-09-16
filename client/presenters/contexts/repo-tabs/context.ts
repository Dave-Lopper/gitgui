import { createContext, Dispatch, SetStateAction } from "react";

const REPOTABS = ["DIFF", "HISTORY"] as const;
export type RepoTab = (typeof REPOTABS)[number];

export type RepoTabs = {
  currentTab: RepoTab;
  setCurrentTab: Dispatch<SetStateAction<RepoTab>>;
};

export const defaultTab = "DIFF";
export const RepoTabsContext = createContext<RepoTabs>({} as RepoTabs);
