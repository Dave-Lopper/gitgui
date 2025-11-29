import { ComponentType, useCallback, useMemo, useState } from "react";

import { useCases } from "../../bootstrap";
import { StatusEntry } from "../../domain/status";
import { useEventSubscription } from "../../infra/react-bus-helper";
import { StatusEntryWithIndex } from "../contexts/repo-tabs/context";
import { useRepositorySelection } from "./hooks/repository-selection";

export type RightClickMenuOptionProps = {
  text: string;
  onClick: () => Promise<void>;
};

export type SelectedFilesCounterProps = {
  count: number;
};

type DiffFileOptionRightClickMenuProps = {
  containerClassname?: string;
  menuOption: ComponentType<RightClickMenuOptionProps>;
  selectedFilesCounter: ComponentType<SelectedFilesCounterProps>;
  position: number[] | null;
};

export default function DiffFileOptionRightClickMenu({
  containerClassname,
  menuOption: MenuOption,
  position,
  selectedFilesCounter: SelectedFilesCounter,
}: DiffFileOptionRightClickMenuProps) {
  const { repositorySelection } = useRepositorySelection();
  const [fileSelection, setFileSelection] = useState<StatusEntryWithIndex[]>(
    [],
  );

  useEventSubscription(
    "DiffSelectionModified",
    async (event) => setFileSelection(event.payload),
    [],
  );

  const addFileTypeToGitignore = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    await useCases.addFileTypeToGitignore.execute(
      repositorySelection.repository.localPath,
      fileSelection[0],
    );
  }, [repositorySelection, fileSelection]);

  const selectedFileExtension = useMemo(() => {
    if (fileSelection.length !== 1) {
      return null;
    }

    const filePathParts = fileSelection[0].path.split(".");
    const extension = filePathParts[filePathParts.length - 1];

    return `.${extension}`;
  }, [fileSelection]);

  const addToGitignore = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    await useCases.addToGitignore.execute(
      repositorySelection.repository.localPath,
      fileSelection.map((file) => file.path),
    );
  }, [repositorySelection, fileSelection]);

  const copyAbsoluteFilePath = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    await useCases.copyAbsoluteFilePath.execute(
      repositorySelection?.repository.localPath,
      fileSelection[0].path,
    );
  }, [repositorySelection, fileSelection]);

  const copyRelativeFilePath = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    await useCases.copyRelativeFilePath.execute(
      repositorySelection?.repository.localPath,
      fileSelection[0].path,
    );
  }, [repositorySelection, fileSelection]);

  const discardChanges = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    await useCases.batchDiscardFileModifications.execute(
      repositorySelection.repository.localPath,
      fileSelection.map((file) => file.path),
    );
  }, [repositorySelection, fileSelection]);

  return (
    <div
      className={`fixed flex flex-col ${containerClassname ? containerClassname : ""}`}
      style={
        position
          ? { top: `${position[1]}px`, left: `${position[0]}px` }
          : { display: "none" }
      }
    >
      <SelectedFilesCounter count={fileSelection.length} />
      <MenuOption text="Discard changes" onClick={discardChanges} />
      <MenuOption text="Add to gitignore" onClick={addToGitignore} />
      {fileSelection.length === 1 && (
        <>
          <MenuOption
            text={`Add all ${selectedFileExtension} files to gitignore`}
            onClick={addFileTypeToGitignore}
          />
          <MenuOption
            text="Copy absolute path"
            onClick={copyAbsoluteFilePath}
          />
          <MenuOption
            text="Copy relative path"
            onClick={copyRelativeFilePath}
          />
        </>
      )}
    </div>
  );
}
