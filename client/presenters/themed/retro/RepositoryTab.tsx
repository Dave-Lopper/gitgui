import { RepoTabProps } from "../../headless/RepositoryTabs";
import RetroButton from "./Button";

export default function RetroRepositoryTab({
  copy,
  active,
  onClick,
}: RepoTabProps) {
  return (
    <RetroButton className="w-1/2 z-0" isActive={active} onClick={onClick}>
      {copy}
    </RetroButton>
  );
}
