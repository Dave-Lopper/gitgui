export const ActionTypeValues = [
  "cloneRepository",
  "getBranchesForRepository",
  "getLocalChangesDiff",
  "getSavedRepositories",
  "selectRepositoryFromSaved",
  "selectRepositoryFromDisk",
] as const;
export type ActionType = (typeof ActionTypeValues)[number];

export type FailedActionResponse = {
  action: ActionType;
  success: false;
  status?: string;
  message?: string;
};

export type SuccesfulActionResponse<T> = {
  action: ActionType;
  success: true;
  data: T;
};

export type ActionResponse<T> =
  | SuccesfulActionResponse<T>
  | FailedActionResponse;
