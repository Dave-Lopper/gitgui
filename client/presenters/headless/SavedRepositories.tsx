import { ComponentType, useCallback, useState } from "react";

import { useCases } from "../../bootstrap";
import { Repository } from "../../domain/repository";
import { useEventSubscription } from "../../infra/react-bus-helper";

export default function SavedRepositories({
  repositoryOption: RepositoryOption,
}: {
  repositoryOption: ComponentType<{
    repository: Repository;
  }>;
}) {
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

  if (!repositories) {
    return;
  }

  return (
    <div className="flex flex-col">
      {repositories.map((repo) => (
        <span onClick={async () => await selectRepository(repo)} role="button">
          <RepositoryOption repository={repo} />
        </span>
      ))}
    </div>
  );
}
