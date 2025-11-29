import { Dispatch, SetStateAction, createContext } from "react";

import { DiffEntry } from "../../../domain/diff";
import { StatusEntry } from "../../../domain/status";

const REPOTABS = ["DIFF", "HISTORY"] as const;
export type RepoTab = (typeof REPOTABS)[number];
export type StatusEntryWithIndex = StatusEntry & { index: number };

export type RepoTabs = {
  currentTab: RepoTab;

  setCurrentTab: Dispatch<SetStateAction<RepoTab>>;
};

export const defaultTab = "DIFF";
export const RepoTabsContext = createContext<RepoTabs>({} as RepoTabs);
