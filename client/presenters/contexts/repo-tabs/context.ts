import { Dispatch, SetStateAction, createContext } from "react";

import { File } from "../../../domain/diff";

const REPOTABS = ["DIFF", "HISTORY"] as const;
export type RepoTab = (typeof REPOTABS)[number];
export type DiffFileWithIndex = File & { index: number };

export type RepoTabs = {
  currentTab: RepoTab;
  selectedFiles: Set<DiffFileWithIndex>;

  deselectFile: (file: DiffFileWithIndex) => void;
  emptyFileSelection: () => void;
  isFileSelected: (file: File) => boolean;
  selectFile: (file: DiffFileWithIndex) => void;
  selectFiles: (files: DiffFileWithIndex[]) => void;
  setCurrentTab: Dispatch<SetStateAction<RepoTab>>;
  toggleFileSelection: (file: DiffFileWithIndex) => void;
};

export const defaultTab = "DIFF";
export const RepoTabsContext = createContext<RepoTabs>({} as RepoTabs);
