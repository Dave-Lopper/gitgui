import { RepoTabProps } from "../../headless/RepositoryTabs";

export default function ModernRepositoryTabs({
  active,
  copy,
  isLast,
  onClick,
}: RepoTabProps) {
  return (
    <div
      className={`${active ? "bg-modern-dark-qua" : "bg-modern-dark-ter hover:bg-modern-dark-qua cursor-pointer transition-colors"} font-modern w-full ${isLast ? "" : "border-r"} border-b border-neutral-400 py-4 text-white`}
      onClick={onClick}
    >
      {copy}
    </div>
  );
}
