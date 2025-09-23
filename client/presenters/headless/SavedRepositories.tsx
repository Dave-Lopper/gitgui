import { ComponentType, ReactNode, useCallback, useState } from "react";

import { useCases } from "../../bootstrap";
import { Repository } from "../../domain/repository";
import { useEventSubscription } from "../../infra/react-bus-helper";

export type SavedRepositoriesProps = {
  className?: string;
  label?: ReactNode;
  repositoryOption: ComponentType<{
    repository: Repository;
    tabIndex?: number;
  }>;
};

export default function SavedRepositories({
  className,
  label,
  repositoryOption: RepositoryOption,
}: SavedRepositoriesProps) {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  useEventSubscription(
    "SavedRepositoriesFetched",
    (event) => setRepositories(event.payload),
    [],
  );

  const selectRepository = useCallback(
    async (repo: Repository) =>
      await useCases.selectRepositoryFromSaved.execute(repo.localPath),
    [useCases],
  );

  if (repositories.length === 0) {
    return;
  }

  return (
    <div className="flex flex-col">
      {label}
      <div className={`flex flex-col ${className ? className : ""}`}>
        {repositories.map((repo, index) => (
          <span
            key={repo.localPath}
            onClick={async () => await selectRepository(repo)}
          >
            <RepositoryOption repository={repo} tabIndex={index + 4} />
          </span>
        ))}
      </div>
    </div>
  );
}
