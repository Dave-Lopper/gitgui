import { ComponentType, useCallback, useContext, useEffect } from "react";

import { useCases } from "../../bootstrap";
import { DiffFile } from "../../domain/diff";
import { RepositorySelectionDto } from "../../dto/repo-selection";
import { RepoTabsContext } from "../contexts/repo-tabs";

export type ThemedFileOption = ComponentType<{
  isSelected: boolean;
  toggleSelection: () => void;
  toggleStaging: () => Promise<void>;
  file: DiffFile;
}>;

export default function ModifiedFilesList({
  repositorySelection,
  themedFileOption: ThemedFileOption,
}: {
  repositorySelection: RepositorySelectionDto;
  themedFileOption: ThemedFileOption;
}) {
  const {
    emptyFileSelection,
    isFileSelected,
    selectFiles,
    selectFile,
    selectedFiles,
    toggleFileSelection,
  } = useContext(RepoTabsContext);

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "KeyA") {
        selectFiles(
          repositorySelection.diff.map((file, idx) => ({
            ...file,
            index: idx,
          })),
        );
      } else if (e.code === "Escape" && selectedFiles.size > 0) {
        emptyFileSelection();
      } else if (e.code === "ArrowDown" && selectedFiles.size > 0) {
        const indexSorted = Array.from(selectedFiles).sort(
          (a, b) => b.index - a.index,
        );
        const maxSelectedIndex = indexSorted[0].index;

        if (!(e.metaKey || e.ctrlKey)) {
          emptyFileSelection();
        }
        if (maxSelectedIndex < repositorySelection.diff.length - 1) {
          selectFile({
            ...repositorySelection.diff[maxSelectedIndex + 1],
            index: maxSelectedIndex + 1,
          });
        } else if (!(e.metaKey || e.ctrlKey)) {
          selectFile({
            ...repositorySelection.diff[0],
            index: 0,
          });
        }
      } else if (e.code === "ArrowUp" && selectedFiles.size > 0) {
        const indexSorted = Array.from(selectedFiles).sort(
          (a, b) => a.index - b.index,
        );
        const minSelectedIndex = indexSorted[0].index;
        if (!(e.metaKey || e.ctrlKey)) {
          emptyFileSelection();
        }
        if (minSelectedIndex > 0) {
          selectFile({
            ...repositorySelection.diff[minSelectedIndex - 1],
            index: minSelectedIndex - 1,
          });
        } else if (!e.metaKey && !e.ctrlKey) {
          selectFile({
            ...repositorySelection.diff[repositorySelection.diff.length - 1],
            index: repositorySelection.diff.length - 1,
          });
        }
      }
    },
    [selectedFiles, repositorySelection],
  );

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [keyDownHandler]);

  return repositorySelection?.diff.map((file, idx) => (
    <ThemedFileOption
      toggleSelection={() => toggleFileSelection({ ...file, index: idx })}
      toggleStaging={async () =>
        await useCases.toggleFilesStaged.execute(
          repositorySelection?.repository.localPath!,
          [file],
        )
      }
      file={file}
      isSelected={isFileSelected(file)}
    />
  ));
}
