export type Branch = {
  isCurrent: boolean;
  isLocal: boolean;
  name: string;
  remote: string | undefined;
};
