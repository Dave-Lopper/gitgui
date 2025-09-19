import { ComponentType } from "react";

import { useRepositorySelection } from "./hooks/repository-selection";
import DiffFileOption from "./DiffFileOption";
import { CheckboxProps } from "./types";
import { DiffFile } from "../../domain/diff";

type ModifiedFilesListProps = {
  checkbox: ComponentType<CheckboxProps>;
  checkboxClassname?: string;
  containerClassName?: string;
  diffFile: ComponentType<{ file: DiffFile; isSelected: boolean }>;
};

export default function ModifiedFilesList({
  checkbox: Checkbox,
  checkboxClassname,
  containerClassName,
  diffFile: DiffFile,
}: ModifiedFilesListProps) {
  const { repositorySelection } = useRepositorySelection();

  return (
    <div
      className={`flex flex-col ${containerClassName ? containerClassName : ""}`}
    >
      {repositorySelection?.diff.map((file) => (
        <DiffFileOption
          key={file.displayPaths.join("+")}
          file={file}
          fileOption={DiffFile}
          checkbox={Checkbox}
        />
      ))}
    </div>
  );
}
