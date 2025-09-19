import { createContext, Dispatch, SetStateAction } from "react";
import { DiffFile } from "../../../domain/diff";

const REPOTABS = ["DIFF", "HISTORY"] as const;
export type RepoTab = (typeof REPOTABS)[number];

export type RepoTabs = {
  currentTab: RepoTab;
  selectedFiles: Set<DiffFile>;

  deselectFile: (file: DiffFile) => void;
  emptyFileSelection: () => void;
  selectFile: (file: DiffFile) => void;
  selectFiles: (files: Set<DiffFile>) => void;
  setCurrentTab: Dispatch<SetStateAction<RepoTab>>;
  toggleFileSelection: (file: DiffFile) => void;
};

export const defaultTab = "DIFF";
export const RepoTabsContext = createContext<RepoTabs>({} as RepoTabs);
