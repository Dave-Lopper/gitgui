import { ReactNode } from "react";

type HeaderProps = {
  branchDropdown: ReactNode;
  repositoryDropdown: ReactNode;
  uiSettings: ReactNode;
};

export default function Header({
  branchDropdown,
  repositoryDropdown,
  uiSettings,
}: HeaderProps) {
  return (
    <header className="flex w-full">
      <div className="w-1/3">{repositoryDropdown}</div>
      <div className="w-1/3">{branchDropdown}</div>
      <div className="w-1/3">{uiSettings}</div>
    </header>
  );
}
