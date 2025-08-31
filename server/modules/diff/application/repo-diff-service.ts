import { BrowserWindow } from "electron";

import { DiffFile } from "../domain/entities.js";

export interface RepoDiffService {
  execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<(DiffFile & { staged: boolean })[]>;
}
