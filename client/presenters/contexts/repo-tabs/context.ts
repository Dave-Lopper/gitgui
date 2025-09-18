import { createContext, Dispatch, SetStateAction } from "react";
import { CurrentDiffFile } from "../../../domain/diff";

const REPOTABS = ["DIFF", "HISTORY"] as const;
export type RepoTab = (typeof REPOTABS)[number];

export type RepoTabs = {
  currentFile?: CurrentDiffFile;
  currentTab: RepoTab;
  selectedFiles: Set<CurrentDiffFile>;

  deselectFile: (file: CurrentDiffFile) => void;
  emptyFileSelection: () => void;
  selectFile: (file: CurrentDiffFile) => void;
  selectFiles: (files: Set<CurrentDiffFile>) => void;
  setCurrentFile: Dispatch<SetStateAction<CurrentDiffFile | undefined>>;
  setCurrentTab: Dispatch<SetStateAction<RepoTab>>;
  toggleFileSelection: (file: CurrentDiffFile) => void;
};

export const defaultTab = "DIFF";
export const RepoTabsContext = createContext<RepoTabs>({} as RepoTabs);
