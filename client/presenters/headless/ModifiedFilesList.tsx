import {
  ComponentType,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useCases } from "../../bootstrap";
import { DiffFile, getFilePath } from "../../domain/diff";
import { RepositorySelectionDto } from "../../dto/repo-selection";
import { RepoTabsContext } from "../contexts/repo-tabs";
import {
  default as RightClickMenu,
  RightClickMenuOptionProps,
  SelectedFilesCounterProps,
} from "./DiffFileOptionRightClickMenu";

export type ThemedFileOptionProps = {
  isSelected: boolean;
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  onContextMenu: (e: MouseEvent<HTMLDivElement>) => void;
  toggleStaging: () => Promise<void>;
  file: DiffFile;
};

export default function ModifiedFilesList({
  repositorySelection,
  rightClickMenuClassname,
  rightClickMenuFilesCounter: RightClickMenuFilesCounter,
  rightClickMenuOption: RightClickMenuOption,
  themedFileOption: ThemedFileOption,
}: {
  repositorySelection: RepositorySelectionDto;
  themedFileOption: ComponentType<ThemedFileOptionProps>;
  rightClickMenuClassname?: string;
  rightClickMenuOption: ComponentType<RightClickMenuOptionProps>;
  rightClickMenuFilesCounter: ComponentType<SelectedFilesCounterProps>;
}) {
  const {
    emptyFileSelection,
    isFileSelected,
    selectFiles,
    selectFile,
    selectedFiles,
    toggleFileSelection,
  } = useContext(RepoTabsContext);

  const [rightClickMenuPosition, setRightClickMenuPosition] = useState<
    number[] | null
  >(null);

  const clickHandler = useCallback(
    (e: MouseEvent<HTMLDivElement>, file: DiffFile, idx: number) => {
      if (rightClickMenuPosition !== null) {
        setRightClickMenuPosition(null);
      }
      if (!(e.ctrlKey || e.metaKey)) {
        emptyFileSelection();
      }
      toggleFileSelection({ ...file, index: idx });
    },
    [selectedFiles, repositorySelection],
  );

  const discardRightClickMenu = useCallback(
    (e: globalThis.MouseEvent) => {
      if (
        e.target instanceof Element &&
        e.target?.closest("[data-file-option]")
      ) {
        return;
      }

      if (rightClickMenuPosition !== null) {
        setRightClickMenuPosition(null);
      }
      if (selectedFiles.size) {
        emptyFileSelection();
      }
    },
    [rightClickMenuPosition],
  );

  const rightClickHandler = useCallback(
    (e: MouseEvent<HTMLDivElement>, file: DiffFile, idx: number) => {
      if (!isFileSelected(file)) {
        emptyFileSelection();
        toggleFileSelection({ ...file, index: idx });
      }
      setRightClickMenuPosition([e.clientX, e.clientY]);
    },
    [selectedFiles, repositorySelection],
  );

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "KeyA") {
        emptyFileSelection();
        selectFiles(
          repositorySelection.diff.map((file, idx) => ({
            ...file,
            index: idx,
          })),
        );
      } else if (e.code === "Escape" && selectedFiles.size > 0) {
        if (rightClickMenuPosition !== null) {
          setRightClickMenuPosition(null);
        }
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
    [selectedFiles, repositorySelection, rightClickMenuPosition],
  );

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("click", discardRightClickMenu);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("click", discardRightClickMenu);
    };
  }, [keyDownHandler, discardRightClickMenu]);

  return (
    <>
      <RightClickMenu
        containerClassname={rightClickMenuClassname}
        menuOption={RightClickMenuOption}
        position={rightClickMenuPosition}
        selectedFilesCounter={RightClickMenuFilesCounter}
      />
      {repositorySelection?.diff.map((file, idx) => (
        <ThemedFileOption
          key={file.displayPaths.join(",")}
          onClick={(e: MouseEvent<HTMLDivElement>) =>
            clickHandler(e, file, idx)
          }
          onContextMenu={(e: MouseEvent<HTMLDivElement>) =>
            rightClickHandler(e, file, idx)
          }
          toggleStaging={async () =>
            await useCases.toggleFilesStaged.execute(
              repositorySelection?.repository.localPath!,
              [file],
            )
          }
          file={file}
          isSelected={isFileSelected(file)}
        />
      ))}
    </>
  );
}
