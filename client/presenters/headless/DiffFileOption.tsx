import { ComponentType, useContext } from "react";

import { DiffFile } from "../../domain/diff";
import { RepoTabsContext } from "../contexts/repo-tabs";
import { CheckboxProps } from "./types";

export type DiffFileOptionProps = {
  checkbox: ComponentType<CheckboxProps>;
  checboxClassname?: string;
  containerClassName?: string;
  file: DiffFile;
  fileOption: ComponentType<{ file: DiffFile; isSelected: boolean }>;
};

export default function DiffFileOption({
  checkbox: Checkbox,
  checboxClassname,
  containerClassName,
  file,
  fileOption: FileOption,
}: DiffFileOptionProps) {
  const { toggleFileSelection, selectedFiles } = useContext(RepoTabsContext);

  return (
    <div
      className={`flex items-center ${containerClassName ? containerClassName : ""}`}
    >
      <Checkbox
        className={checboxClassname}
        isChecked={selectedFiles.has(file)}
        onClick={() => toggleFileSelection(file)}
      />
      <FileOption file={file} isSelected={selectedFiles.has(file)} />
    </div>
  );
}
