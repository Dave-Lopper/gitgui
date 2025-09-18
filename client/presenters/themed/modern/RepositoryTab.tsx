import { RepoTabProps } from "../../headless/RepositoryTabs";

export default function ModernRepositoryTabs({
  active,
  copy,
  isLast,
  onClick,
}: RepoTabProps) {
  return (
    <div
      className={`${active ? "bg-modern-dark-tri" : "bg-modern-dark-sec hover:bg-modern-dark-tri cursor-pointer transition-colors"} font-modern w-full ${isLast ? "" : "border-r"} border-b border-modern-dark-border py-4 text-white`}
      onClick={onClick}
    >
      {copy}
    </div>
  );
}
