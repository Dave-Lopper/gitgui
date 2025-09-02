export type Branch = {
  name: string;
  isCurrent: boolean;
  isLocal: boolean;
  remote?: string;
};
