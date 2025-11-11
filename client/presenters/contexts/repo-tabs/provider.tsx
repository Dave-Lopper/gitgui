import { ReactNode, useCallback, useEffect, useState } from "react";

import { useCases } from "../../../bootstrap";
import { DiffEntry } from "../../../domain/diff";
import { StatusEntry } from "../../../domain/status";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { useRepositorySelection } from "../../headless";
import {
  RepoTab,
  RepoTabsContext,
  StatusEntryWithIndex,
  defaultTab,
} from "./context";

export function RepoTabsContextProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<RepoTab>(defaultTab);
  const [selectedFiles, setSelectedFiles] = useState<Set<StatusEntryWithIndex>>(
    new Set(),
  );
  const [selectedDiff, setSelectedDiff] = useState<DiffEntry>();
  const { repositorySelection } = useRepositorySelection(true);

  const deselectFile = useCallback(
    (file: StatusEntryWithIndex) =>
      setSelectedFiles((files) => {
        const newFiles = new Set(files);
        newFiles.delete(file);
        return newFiles;
      }),
    [],
  );

  const emptyFileSelection = useCallback(() => setSelectedFiles(new Set()), []);

  const selectFile = useCallback(
    (file: StatusEntryWithIndex) =>
      setSelectedFiles((files) => {
        const newFiles = new Set(files);
        newFiles.add(file);
        return newFiles;
      }),
    [],
  );

  const isFileSelected = useCallback(
    (file: StatusEntry) => {
      const selectedFileNames = Array.from(selectedFiles, (file) => file.path);
      return selectedFileNames.includes(file.path);
    },
    [selectedFiles],
  );

  const selectFiles = useCallback((files: StatusEntryWithIndex[]) => {
    setSelectedFiles((currentFiles) => {
      const newFiles = new Set(currentFiles);
      files.forEach((file) => newFiles.add(file));
      return newFiles;
    });
  }, []);

  const toggleFileSelection = useCallback(
    (file: StatusEntryWithIndex) => {
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

  useEffect(() => {
    console.log("Running effect", { selectedFilesSize: selectedFiles.size });
    if (selectedFiles.size === 1) {
      const fetchSelectedDiff = async () => {
        console.log("Running async fetched", { repositorySelection });
        if (!repositorySelection) {
          return;
        }
        await useCases.getTreeFileDiff.execute(
          repositorySelection.repository.localPath,
          selectedFiles.values().next().value!,
        );
      };
      fetchSelectedDiff();
    } else {
      setSelectedDiff(undefined);
    }
  }, [repositorySelection, selectedFiles]);

  useEventSubscription(
    "FileDiffConsulted",
    (event) => setSelectedDiff(event.payload),
    [],
  );

  return (
    <RepoTabsContext.Provider
      value={{
        currentTab,
        deselectFile,
        emptyFileSelection,
        isFileSelected,
        selectedDiff,
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
