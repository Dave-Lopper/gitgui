export type LocalRef = Readonly<{
  name: string;
}>;

export type RemoteRef = Readonly<{ name: string; remoteName: string }>;

export type RepositoryReferences = { local: LocalRef[]; remote: RemoteRef[] };
