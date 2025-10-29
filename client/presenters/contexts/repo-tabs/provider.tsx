import { ReactNode, useCallback, useState } from "react";

import { File } from "../../../domain/diff";
import {
  DiffFileWithIndex,
  RepoTab,
  RepoTabsContext,
  defaultTab,
} from "./context";

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
    (file: File) => {
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

  const toggleFileSelection = useCallback(
    (file: DiffFileWithIndex) => {
      setSelectedFiles((files) => {
        let newFiles;
        if (isFileSelected(file)) {
          newFiles = new Set(
            Array.from(files).filter((f) => f.path !== file.path),
          );
        } else {
          const newFilesArray = Array.from(files);
          newFilesArray.push(file);
          newFiles = new Set(newFilesArray);
        }
        return newFiles;
      });
    },
    [selectedFiles],
  );

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
