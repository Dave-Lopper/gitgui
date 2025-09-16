import { RepoTabProps } from "../../headless/RepositoryTabs";

export default function ModernRepositoryTabs({
  active,
  copy,
  onClick,
}: RepoTabProps) {
  return (
    <div
      className={`${active ? "bg-modern-dark-qua" : "bg-modern-dark-ter hover:bg-modern-dark-qua cursor-pointer transition-colors"} font-modern w-full border-r border-b border-neutral-300 py-4 text-white`}
      onClick={onClick}
    >
      {copy}
    </div>
  );
}
