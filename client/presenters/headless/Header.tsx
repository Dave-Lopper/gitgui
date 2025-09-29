import { ReactNode } from "react";

type HeaderProps = {
  branchDropdown: ReactNode;
  className?: string;
  contextualMenu: ReactNode;
  repositoryDropdown: ReactNode;
  uiSettings: ReactNode;
};

export default function Header({
  branchDropdown,
  className,
  contextualMenu,
  repositoryDropdown,
  uiSettings,
}: HeaderProps) {
  return (
    <header className={`flex w-full ${className ? className : ""}`}>
      <div className="flex max-h-full w-4/5">
        <div className="max-h-full w-1/3">{repositoryDropdown}</div>
        <div className="max-h-full w-1/3">{branchDropdown}</div>
        <div className="max-h-full w-1/3">{contextualMenu}</div>
      </div>
      <div className="w-1/5">
        <div className="max-h-full">{uiSettings}</div>
      </div>
    </header>
  );
}
