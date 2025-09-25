import { SelectedFilesCounterProps } from "../../headless/DiffFileOptionRightClickMenu";

export default function RetroDiffFileRightClickMenuFilesCounter({
  count,
}: SelectedFilesCounterProps) {
  return count > 1 && <span className="text-center">{count} selected files</span>;
}
