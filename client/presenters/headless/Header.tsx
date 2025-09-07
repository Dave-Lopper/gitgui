import { ReactNode } from "react";

type HeaderProps = {
  branchDropdown: ReactNode;
  repositoryDropdown: ReactNode;
};

export default function Header({
  branchDropdown,
  repositoryDropdown,
}: HeaderProps) {
  return (
    <header className="flex w-full">
      <div className="w-1/3">{repositoryDropdown}</div>
      <div className="w-1/3">{branchDropdown}</div>
      <div className="w-1/3">UI Settings</div>
    </header>
  );
}
