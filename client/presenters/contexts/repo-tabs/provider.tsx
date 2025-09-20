import { ReactNode, useCallback, useState } from "react";

import {
  defaultTab,
  DiffFileWithIndex,
  RepoTabsContext,
  RepoTab,
} from "./context";
import { DiffFile } from "../../../domain/diff";

export function RepoTabsContextProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<RepoTab>(defaultTab);
  const [selectedFiles, setSelectedFiles] = useState<Set<DiffFileWithIndex>>(
    new Set(),
  );

  const deselectFile = useCallback(
    (file: DiffFileWithIndex) =>
      setSelectedFiles((files) => {
        const newFiles = new Set(files);
        newFiles.delete(file);
        return newFiles;
      }),
    [],
  );

  const emptyFileSelection = useCallback(() => setSelectedFiles(new Set()), []);

  const selectFile = useCallback(
    (file: DiffFileWithIndex) =>
      setSelectedFiles((files) => {
        const newFiles = new Set(files);
        newFiles.add(file);
        return newFiles;
      }),
    [],
  );

  const isFileSelected = useCallback(
    (file: DiffFile) => {
      const selectedFileNames = Array.from(selectedFiles, (file) =>
        file.displayPaths.join(","),
      );
      return selectedFileNames.includes(file.displayPaths.join(","));
    },
    [selectedFiles],
  );

  const selectFiles = useCallback((files: DiffFileWithIndex[]) => {
    setSelectedFiles((currentFiles) => {
      const newFiles = new Set(currentFiles);
      files.forEach((file) => newFiles.add(file));
      return newFiles;
    });
  }, []);

  const toggleFileSelection = useCallback((file: DiffFileWithIndex) => {
    setSelectedFiles((files) => {
      const newFiles = new Set(files);
      if (newFiles.has(file)) {
        newFiles.delete(file);
      } else {
        newFiles.add(file);
      }
      return newFiles;
    });
  }, []);

  return (
    <RepoTabsContext.Provider
      value={{
        currentTab,
        deselectFile,
        emptyFileSelection,
        isFileSelected,
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
