import { BrowserWindow } from "electron";

import { CommitStatus } from "../dto/commit-status.js";

export interface CommitStatusService {
  execute(repositoryPath: string, window: BrowserWindow): Promise<CommitStatus>;
}
