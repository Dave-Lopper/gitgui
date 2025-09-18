import { ComponentType, useContext } from "react";

import { CurrentDiffFile } from "../../domain/diff";
import { RepoTabsContext } from "../contexts/repo-tabs";

type DiffFileOptionProps = {
  checkbox: ComponentType<{ isChecked: boolean; onClick: () => void }>;
  containerClassName?: string;
  file: CurrentDiffFile;
  fileOption: ComponentType<{ file: CurrentDiffFile }>;
};

export default function DiffFileOption({
  containerClassName,
  checkbox: Checkbox,
  file,
  fileOption: FileOption,
}: DiffFileOptionProps) {
  const { toggleFileSelection } = useContext(RepoTabsContext);

  <div
    className={`flex items-center ${containerClassName ? containerClassName : ""}`}
  >
    <Checkbox
      isChecked={file.staged}
      onClick={() => toggleFileSelection(file)}
    />
    <FileOption file={file} />
  </div>;
}
