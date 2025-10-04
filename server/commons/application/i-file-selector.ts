type CanceledFilePathSelection = {
  status: "CANCELED";
};

type CompletedFilePathSelection = {
  status: "COMPLETED";
  paths: string[];
};

export type LocalFilePathSelection =
  | CanceledFilePathSelection
  | CompletedFilePathSelection;

export interface ILocalFilePathSelector {
  selectPath(defaultPath?: string): Promise<LocalFilePathSelection>;
}
