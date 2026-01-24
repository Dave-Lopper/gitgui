import {
  ComponentType,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useCases } from "../../bootstrap";
import { StatusEntry } from "../../domain/status";
import { RepositorySelectionDto } from "../../dto/repo-selection";
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
  file: StatusEntry;
  showStaged: boolean;
};

export default function ModifiedFilesList({
  commitHash,
  containerClassname,
  repositorySelection,
  rightClickMenuClassname,
  rightClickMenuFilesCounter: RightClickMenuFilesCounter,
  rightClickMenuOption: RightClickMenuOption,
  statusEntries,
  themedFileOption: ThemedFileOption,
}: {
  commitHash: string | undefined;
  containerClassname?: string;
  repositorySelection: RepositorySelectionDto;
  rightClickMenuClassname?: string;
  rightClickMenuFilesCounter: ComponentType<SelectedFilesCounterProps>;
  rightClickMenuOption: ComponentType<RightClickMenuOptionProps>;
  statusEntries: StatusEntry[];
  themedFileOption: ComponentType<ThemedFileOptionProps>;
}) {
  const [fileSelection, setFileSelection] = useState<Set<string>>(new Set());
  useEffect(() => {
    const triggerUseCase = async () =>
      await useCases.modifyFileDiffSelection.execute(
        repositorySelection.repository.localPath,
        repositorySelection.repository.remoteName || "origin",
        repositorySelection.repository.checkedOutBranch,
        fileSelection,
        commitHash,
      );
    triggerUseCase();
  }, [fileSelection]);

  const [rightClickMenuPosition, setRightClickMenuPosition] = useState<
    number[] | null
  >(null);

  const clickHandler = useCallback(
    async (e: MouseEvent<HTMLDivElement>, file: StatusEntry, idx: number) => {
      if (rightClickMenuPosition !== null) {
        setRightClickMenuPosition(null);
      }
      if (!(e.ctrlKey || e.metaKey)) {
        setFileSelection(new Set());
      }
      const serialized = JSON.stringify({ ...file, index: idx });
      if (fileSelection.has(serialized)) {
        setFileSelection((prev) => {
          const next = new Set(prev);
          next.delete(serialized);
          return next;
        });
      } else {
        setFileSelection((prev) => new Set(prev).add(serialized));
      }
    },
    [fileSelection, repositorySelection, statusEntries],
  );

  const discardRightClickMenu = useCallback(
    async (e: globalThis.MouseEvent) => {
      if (
        e.target instanceof Element &&
        e.target?.closest("[data-file-option]")
      ) {
        return;
      }

      if (rightClickMenuPosition !== null) {
        setRightClickMenuPosition(null);
      }
      if (fileSelection.size) {
        setFileSelection(new Set());
      }
    },
    [rightClickMenuPosition],
  );

  const rightClickHandler = useCallback(
    async (e: MouseEvent<HTMLDivElement>, file: StatusEntry, idx: number) => {
      setFileSelection(new Set(JSON.stringify({ ...file, index: idx })));
      setRightClickMenuPosition([e.clientX, e.clientY]);
    },
    [fileSelection, repositorySelection, statusEntries],
  );

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "KeyA") {
        setFileSelection(
          new Set(
            statusEntries.map((file, idx) =>
              JSON.stringify({
                ...file,
                index: idx,
              }),
            ),
          ),
        );
      } else if (e.code === "Escape" && fileSelection.size > 0) {
        if (rightClickMenuPosition !== null) {
          setRightClickMenuPosition(null);
        }
        setFileSelection(new Set());
      } else if (e.code === "ArrowDown" && fileSelection.size > 0) {
        const indexSorted = Array.from(fileSelection)
          .map((item) => JSON.parse(item))
          .sort((a, b) => b.index - a.index);
        const maxSelectedIndex = indexSorted[0].index;

        if (!(e.metaKey || e.ctrlKey)) {
          setFileSelection(new Set());
        }
        if (maxSelectedIndex < statusEntries.length - 1) {
          setFileSelection((prev) =>
            new Set(prev).add(
              JSON.stringify({
                ...statusEntries[maxSelectedIndex + 1],
                index: maxSelectedIndex + 1,
              }),
            ),
          );
        } else if (!(e.metaKey || e.ctrlKey)) {
          setFileSelection((prev) =>
            new Set(prev).add(
              JSON.stringify({
                ...statusEntries[0],
                index: 0,
              }),
            ),
          );
        }
      } else if (e.code === "ArrowUp" && fileSelection.size > 0) {
        const indexSorted = Array.from(fileSelection)
          .map((item) => JSON.parse(item))
          .sort((a, b) => a.index - b.index);
        const minSelectedIndex = indexSorted[0].index;
        if (!(e.metaKey || e.ctrlKey)) {
          setFileSelection(new Set());
        }
        if (minSelectedIndex > 0) {
          setFileSelection((prev) =>
            new Set(prev).add(
              JSON.stringify({
                ...statusEntries[minSelectedIndex - 1],
                index: minSelectedIndex - 1,
              }),
            ),
          );
        } else if (!e.metaKey && !e.ctrlKey) {
          setFileSelection((prev) =>
            new Set(prev).add(
              JSON.stringify({
                ...statusEntries[statusEntries.length - 1],
                index: statusEntries.length - 1,
              }),
            ),
          );
        }
      }
    },
    [fileSelection, repositorySelection, rightClickMenuPosition, statusEntries],
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
    <div
      className={`flex flex-col ${containerClassname ? containerClassname : ""} overflow-auto`}
    >
      <RightClickMenu
        containerClassname={rightClickMenuClassname}
        menuOption={RightClickMenuOption}
        position={rightClickMenuPosition}
        selectedFilesCounter={RightClickMenuFilesCounter}
      />
      {statusEntries.map((file, index) => (
        <ThemedFileOption
          key={file.path}
          onClick={(e: MouseEvent<HTMLDivElement>) =>
            clickHandler(e, file, index)
          }
          onContextMenu={(e: MouseEvent<HTMLDivElement>) =>
            rightClickHandler(e, file, index)
          }
          showStaged={commitHash === undefined}
          toggleStaging={async () =>
            await useCases.toggleFilesStaged.execute(
              repositorySelection?.repository.localPath!,
              file,
              index,
              repositorySelection,
            )
          }
          file={file}
          isSelected={fileSelection.has(JSON.stringify({ ...file, index }))}
        />
      ))}
    </div>
  );
}
