import { Dispatch, SetStateAction, createContext } from "react";

import { DiffEntry } from "../../../domain/diff";
import { StatusEntry } from "../../../domain/status";

const REPOTABS = ["DIFF", "HISTORY"] as const;
export type RepoTab = (typeof REPOTABS)[number];
export type StatusEntryWithIndex = StatusEntry & { index: number };

export type RepoTabs = {
  currentTab: RepoTab;
  selectedDiff: DiffEntry | undefined;
  selectedFiles: Set<StatusEntryWithIndex>;

  deselectFile: (file: StatusEntryWithIndex) => void;
  emptyFileSelection: () => void;
  isFileSelected: (file: StatusEntry) => boolean;
  selectFile: (file: StatusEntryWithIndex) => void;
  selectFiles: (files: StatusEntryWithIndex[]) => void;
  setCurrentTab: Dispatch<SetStateAction<RepoTab>>;
  toggleFileSelection: (file: StatusEntryWithIndex) => void;
};

export const defaultTab = "DIFF";
export const RepoTabsContext = createContext<RepoTabs>({} as RepoTabs);
