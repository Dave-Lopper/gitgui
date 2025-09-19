import { ComponentType, useContext } from "react";

import { DiffFile } from "../../domain/diff";
import { RepoTabsContext } from "../contexts/repo-tabs";
import { useCases } from "../../bootstrap";
import { RepositorySelectionDto } from "../../dto/repo-selection";

export type DiffFileOptionProps = {
  repositorySelection: RepositorySelectionDto;
  themedFileOption: ComponentType<{
    isSelected: boolean;
    toggleSelection: () => void;
    toggleStaging: () => Promise<void>;
    file: DiffFile;
  }>;
  file: DiffFile;
};

export default function DiffFileOption({
  file,
  repositorySelection,
  themedFileOption: ThemedFileOption,
}: DiffFileOptionProps) {
  const { toggleFileSelection, selectedFiles } = useContext(RepoTabsContext);

  return (
    <ThemedFileOption
      toggleSelection={() => toggleFileSelection(file)}
      toggleStaging={async () =>
        await useCases.toggleFilesStaged.execute(
          repositorySelection?.repository.localPath!,
          [file],
        )
      }
      file={file}
      isSelected={selectedFiles.has(file)}
    />
  );
}
