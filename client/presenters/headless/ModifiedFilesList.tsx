import { ComponentType, useContext } from "react";

import { CurrentDiffFile } from "../../domain/diff";
import { RepoTabsContext } from "../contexts/repo-tabs";
import { useRepositorySelection } from "./hooks/repository-selection";

export type DiffFileProps = {
  isSelected: boolean;
  file: CurrentDiffFile;
  onClick: () => void;
};

type ModifiedFilesListProps = {
  containerClassName?: string;
  diffFile: ComponentType<DiffFileProps>;
};

export default function ModifiedFilesList({
  containerClassName,
  diffFile: DiffFile,
}: ModifiedFilesListProps) {
  const { repositorySelection } = useRepositorySelection();
  const { currentFile, setCurrentFile } = useContext(RepoTabsContext);

  return (
    <div
      className={`flex flex-col ${containerClassName ? containerClassName : ""}`}
    >
      {repositorySelection?.diff.map((file) => (
        <DiffFile
          key={file.displayPaths.join("+")}
          isSelected={currentFile === file}
          file={file}
          onClick={() => setCurrentFile(file)}
        />
      ))}
    </div>
  );
}
