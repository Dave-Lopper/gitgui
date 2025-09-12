import { ComponentType, useCallback, useState } from "react";

import { useCases } from "../../bootstrap";
import { Repository } from "../../domain/repository";
import { useEventSubscription } from "../../infra/react-bus-helper";

export type SavedRepositoriesProps = {
  className?: string;
  repositoryOption: ComponentType<{
    repository: Repository;
    tabIndex?: number;
  }>;
};

const testRepos = [
  {
    name: "upscale-backend",
    url: "https://ap-southeast-1.codecommit.com/upscale/upscale-backend",
    remoteName: "origin",
    lastFetchedAt: undefined,
    localPath: "/home/alexishaim/upscale/upscale-backend",
    checkedOutBranch: "develop",
    branches: [
      {
        name: "develop",
        isCurrent: true,
        isLocal: false,
        remote: "origin",
      },
      {
        name: "staging",
        isCurrent: true,
        isLocal: false,
        remote: "origin",
      },
      {
        name: "master",
        isCurrent: true,
        isLocal: false,
        remote: "origin",
      },
    ],
  },
  {
    name: "upscale-frontend",
    url: "https://ap-southeast-1.codecommit.com/upscale/upscale-frontend",
    remoteName: "origin",
    lastFetchedAt: undefined,
    localPath: "/home/alexishaim/upscale/upscale-frontend",
    checkedOutBranch: "develop",
    branches: [
      {
        name: "develop",
        isCurrent: true,
        isLocal: false,
        remote: "origin",
      },
      {
        name: "staging",
        isCurrent: true,
        isLocal: false,
        remote: "origin",
      },
      {
        name: "master",
        isCurrent: true,
        isLocal: false,
        remote: "origin",
      },
    ],
  },
  {
    name: "upscale-uplinks",
    url: "https://ap-southeast-1.codecommit.com/upscale/upscale-uplinks",
    remoteName: "origin",
    lastFetchedAt: undefined,
    localPath: "/home/alexishaim/upscale/upscale-uplinks",
    checkedOutBranch: "develop",
    branches: [
      {
        name: "develop",
        isCurrent: true,
        isLocal: false,
        remote: "origin",
      },
      {
        name: "staging",
        isCurrent: true,
        isLocal: false,
        remote: "origin",
      },
      {
        name: "master",
        isCurrent: true,
        isLocal: false,
        remote: "origin",
      },
    ],
  },
];

export default function SavedRepositories({
  className,
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

  // if (!repositories) {
  //   return;
  // }

  return (
    <div className={`flex flex-col ${className ? className : ""}`}>
      {testRepos.map((repo, index) => (
        <span onClick={async () => await selectRepository(repo)}>
          <RepositoryOption repository={repo} tabIndex={index + 4} />
        </span>
      ))}
    </div>
  );
}
