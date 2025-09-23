import { ReactNode, useState } from "react";

type HeaderProps = {
  branchDropdown: ReactNode;
  className?: string;
  repositoryDropdown: ReactNode;
  uiSettings: ReactNode;
};

export default function Header({
  branchDropdown,
  className,
  repositoryDropdown,
  uiSettings,
}: HeaderProps) {
  return (
    <header className={`flex w-full ${className ? className : ""}`}>
      <div className="max-h-full w-1/3">{repositoryDropdown}</div>
      <div className="max-h-full w-1/3">{branchDropdown}</div>
      <div className="max-h-full w-1/3">{uiSettings}</div>
    </header>
  );
}
