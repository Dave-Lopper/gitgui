import {
  ComponentType,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCases } from "../../bootstrap";
import { StatusEntry } from "../../domain/status";
import { RepositorySelectionDto } from "../../dto/repo-selection";
import ContextMenu, { ContextMenuItemProps } from "./ContextMenu";
import { useContextMenu } from "./hooks/context-menu";

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
  contextMenuOption: ContextMenuOption,
  statusEntries,
  themedFileOption: ThemedFileOption,
  themedEmptyState: ThemedEmptyState,
}: {
  commitHash: string | undefined;
  containerClassname?: string;
  repositorySelection: RepositorySelectionDto;
  contextMenuOption: ComponentType<ContextMenuItemProps>;
  statusEntries: StatusEntry[];
  themedFileOption: ComponentType<ThemedFileOptionProps>;
  themedEmptyState?: ComponentType<{}>;
}) {
  const [fileSelection, setFileSelection] = useState<Set<string>>(new Set());

  const contextMenuItems = useMemo<ContextMenuItemProps[]>(() => {
    const items = [
      {
        text: "Discard changes",
        onClick: async () => {
          const filePaths: string[] = [];
          fileSelection.forEach((file) =>
            filePaths.push(JSON.parse(file).path),
          );
          return await useCases.batchDiscardFileModifications.execute(
            repositorySelection.repository.localPath,
            filePaths,
          );
        },
      },
      {
        text: "Add to gitignore",
        onClick: async () => {
          const filePaths: string[] = [];
          fileSelection.forEach((file) =>
            filePaths.push(JSON.parse(file).path),
          );
          return await useCases.batchDiscardFileModifications.execute(
            repositorySelection.repository.localPath,
            filePaths,
          );
        },
      },
    ];

    if (fileSelection.size === 1) {
      const selectedFile = JSON.parse(fileSelection.values().next().value!);
      const filePathParts = selectedFile.path.split(".");
      const fileExtension = filePathParts[filePathParts.length - 1];
      items.push({
        text: `Add all .${fileExtension} to gitignore`,
        onClick: async () =>
          await useCases.addFileTypeToGitignore.execute(
            repositorySelection.repository.localPath,
            selectedFile,
          ),
      });
    }

    items.push(
      {
        text: "Copy absolute path",
        onClick: async () => {
          const selectedFile = JSON.parse(fileSelection.values().next().value!);
          return await useCases.copyAbsoluteFilePath.execute(
            repositorySelection.repository.localPath,
            selectedFile.path,
          );
        },
      },
      {
        text: "Copy relative path",
        onClick: async () => {
          const selectedFile = JSON.parse(fileSelection.values().next().value!);
          return await useCases.copyRelativeFilePath.execute(
            repositorySelection?.repository.localPath,
            selectedFile.path,
          );
        },
      },
      {
        text: "Stash file",
        onClick: async () => {
          const selectedFile = JSON.parse(fileSelection.values().next().value!);
          return await useCases.stashFile.execute(
            repositorySelection?.repository.localPath,
            selectedFile.path,
          );
        },
      },
    );
    return items;
  }, [fileSelection]);
  const contextMenu = useContextMenu();

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
      setFileSelection(new Set([JSON.stringify({ ...file, index: idx })]));
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
      className={`flex flex-col ${containerClassname ? containerClassname : ""} overflow-auto ${statusEntries.length > 0 ? "justify-start" : "justify-center"} h-full`}
      onContextMenu={(e) => {
        contextMenu.open(e);
        e.preventDefault();
      }}
    >
      <ContextMenu
        containerClassName="bg-retro font-retro retro-borders absolute w-[300px] border-[2px] text-black"
        isOpen={contextMenu.isOpen}
        itemComponent={ContextMenuOption}
        items={contextMenuItems}
        position={contextMenu.position}
        onClose={() => {
          contextMenu.close();
        }}
      />
      {statusEntries.length === 0 && ThemedEmptyState !== undefined ? (
        <ThemedEmptyState />
      ) : (
        statusEntries.map((file, index) => (
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
        ))
      )}
    </div>
  );
}
