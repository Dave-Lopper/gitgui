import { ReactNode, useCallback, useState } from "react";

import { defaultTab, RepoTabsContext, RepoTab } from "./context";
import { DiffFile } from "../../../domain/diff";

export function RepoTabsContextProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<RepoTab>(defaultTab);
  const [selectedFiles, setSelectedFiles] = useState<Set<DiffFile>>(new Set());

  const deselectFile = useCallback(
    (file: DiffFile) =>
      setSelectedFiles((files) => {
        const newFiles = new Set(files);
        newFiles.delete(file);
        return newFiles;
      }),
    [],
  );

  const emptyFileSelection = useCallback(() => setSelectedFiles(new Set()), []);

  const selectFile = useCallback(
    (file: DiffFile) =>
      setSelectedFiles((files) => {
        const newFiles = new Set(files);
        newFiles.add(file);
        return newFiles;
      }),
    [],
  );

  const selectFiles = useCallback(
    (files: Set<DiffFile>) =>
      setSelectedFiles((currentFiles) => {
        const newFiles = new Set(currentFiles);
        files.forEach((file) => newFiles.add(file));
        return newFiles;
      }),
    [],
  );

  const toggleFileSelection = useCallback(
    (file: DiffFile) =>
      setSelectedFiles((files) => {
        const newFiles = new Set(files);
        if (newFiles.has(file)) {
          newFiles.delete(file);
        } else {
          newFiles.add(file);
        }
        return newFiles;
      }),
    [],
  );

  return (
    <RepoTabsContext.Provider
      value={{
        currentTab,
        deselectFile,
        emptyFileSelection,
        selectedFiles,
        selectFile,
        selectFiles,
        setCurrentTab,
        toggleFileSelection,
      }}
    >
      {children}
    </RepoTabsContext.Provider>
  );
}
