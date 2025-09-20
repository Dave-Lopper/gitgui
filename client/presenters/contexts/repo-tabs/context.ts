import { createContext, Dispatch, SetStateAction } from "react";
import { DiffFile } from "../../../domain/diff";

const REPOTABS = ["DIFF", "HISTORY"] as const;
export type RepoTab = (typeof REPOTABS)[number];
export type DiffFileWithIndex = DiffFile & { index: number };

export type RepoTabs = {
  currentTab: RepoTab;
  selectedFiles: Set<DiffFileWithIndex>;

  deselectFile: (file: DiffFileWithIndex) => void;
  emptyFileSelection: () => void;
  isFileSelected: (file: DiffFile) => boolean;
  selectFile: (file: DiffFileWithIndex) => void;
  selectFiles: (files: DiffFileWithIndex[]) => void;
  setCurrentTab: Dispatch<SetStateAction<RepoTab>>;
  toggleFileSelection: (file: DiffFileWithIndex) => void;
};

export const defaultTab = "DIFF";
export const RepoTabsContext = createContext<RepoTabs>({} as RepoTabs);
