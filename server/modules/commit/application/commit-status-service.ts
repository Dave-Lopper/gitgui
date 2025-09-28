import { BrowserWindow } from "electron";

import { CommitStatusDto } from "../dto/commit-status.js";

export interface CommitStatusService {
  execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<CommitStatusDto>;
}
