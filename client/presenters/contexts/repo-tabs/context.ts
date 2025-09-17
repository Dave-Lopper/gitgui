import { createContext, Dispatch, SetStateAction } from "react";
import { CurrentDiffFile } from "../../../domain/diff";

const REPOTABS = ["DIFF", "HISTORY"] as const;
export type RepoTab = (typeof REPOTABS)[number];

export type RepoTabs = {
  currentFile?: CurrentDiffFile;
  currentTab: RepoTab;

  setCurrentFile: Dispatch<SetStateAction<CurrentDiffFile | undefined>>;
  setCurrentTab: Dispatch<SetStateAction<RepoTab>>;
};

export const defaultTab = "DIFF";
export const RepoTabsContext = createContext<RepoTabs>({} as RepoTabs);
