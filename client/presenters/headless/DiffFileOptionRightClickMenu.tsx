import { ComponentType, useCallback, useContext, useMemo } from "react";

import { useCases } from "../../bootstrap";
import { getFilePath } from "../../domain/diff";
import { RepoTabsContext } from "../contexts/repo-tabs";
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
  const { selectedFiles } = useContext(RepoTabsContext);

  const addFileTypeToGitignore = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    const [selectedFile] = selectedFiles;
    await useCases.addFileTypeToGitignore.execute(
      repositorySelection.repository.localPath,
      selectedFile,
    );
  }, [repositorySelection, selectedFiles]);

  const selectedFileExtension = useMemo(() => {
    if (selectedFiles.size !== 1) {
      return null;
    }
    const [selectedFile] = selectedFiles;
    const filePathParts = getFilePath(selectedFile).split(".");
    const extension = filePathParts[filePathParts.length - 1];

    return `.${extension}`;
  }, [selectedFiles]);

  const addToGitignore = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    await useCases.addToGitignore.execute(
      repositorySelection.repository.localPath,
      Array.from(selectedFiles).map((file) => getFilePath(file)),
    );
  }, [repositorySelection, selectedFiles]);

  const copyAbsoluteFilePath = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    const [selectedFile] = selectedFiles;
    await useCases.copyAbsoluteFilePath.execute(
      repositorySelection?.repository.localPath,
      getFilePath(selectedFile),
    );
  }, [repositorySelection, selectedFiles]);

  const copyRelativeFilePath = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    const [selectedFile] = selectedFiles;
    await useCases.copyRelativeFilePath.execute(
      repositorySelection?.repository.localPath,
      getFilePath(selectedFile),
    );
  }, [repositorySelection, selectedFiles]);

  const discardChanges = useCallback(async () => {
    if (!repositorySelection) {
      return;
    }

    await useCases.batchDiscardFileModifications.execute(
      repositorySelection.repository.localPath,
      Array.from(selectedFiles).map((file) => getFilePath(file)),
    );
  }, [repositorySelection, selectedFiles]);

  return (
    <div
      className={`fixed flex flex-col ${containerClassname ? containerClassname : ""}`}
      style={
        position
          ? { top: `${position[1]}px`, left: `${position[0]}px` }
          : { display: "none" }
      }
    >
      <SelectedFilesCounter count={selectedFiles.size} />
      <MenuOption text="Discard changes" onClick={discardChanges} />
      <MenuOption text="Add to gitignore" onClick={addToGitignore} />
      {selectedFiles.size === 1 && (
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
