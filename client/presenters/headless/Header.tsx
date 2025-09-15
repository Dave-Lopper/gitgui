import { ReactNode, useState } from "react";
import { Repository } from "../../domain/repository";
import { useEventSubscription } from "../../infra/react-bus-helper";

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
  const [selectedRepository, setSelectedRepository] =
    useState<Repository | null>(null);

  useEventSubscription(
    "RepositorySelected",
    (event) => setSelectedRepository(event.payload),
    [],
  );

  return (
    <header className="flex w-full">
      <div className="w-1/3">{repositoryDropdown}</div>
      <div className="w-1/3">{branchDropdown}</div>
      <div className="w-1/3">{uiSettings}</div>
    </header>
  );
}
