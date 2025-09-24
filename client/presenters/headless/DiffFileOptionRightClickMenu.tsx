import { ComponentType, useCallback, useContext, useMemo } from "react";

import { useCases } from "../../bootstrap";
import { getFilePath } from "../../domain/diff";
import { RepoTabsContext } from "../contexts/repo-tabs";
import { useRepositorySelection } from "./hooks/repository-selection";

type DiffFileOptionRightClickMenuProps = {
  containerClassname?: string;
  menuOption: ComponentType<{ text: string; onClick: () => Promise<void> }>;
  selectedFilesCounter: ComponentType<{ count: number }>;
  posLeft: number;
  posTop: number;
};

export default function DiffFileOptionRightClickMenu({
  containerClassname,
  menuOption: MenuOption,
  posLeft,
  posTop,
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
      className={`absolute flex flex-col ${containerClassname ? containerClassname : ""}`}
      style={{ top: `${posTop}px`, left: `${posLeft}px` }}
    >
      <SelectedFilesCounter count={selectedFiles.size} />
      <MenuOption text="Discard changes" onClick={discardChanges} />
      <MenuOption text="Add to gitignore" onClick={addToGitignore} />
      {selectedFiles.size === 1 && (
        <MenuOption
          text={`Add all ${selectedFileExtension} files to gitignore`}
          onClick={addFileTypeToGitignore}
        />
      )}
    </div>
  );
}
