import { BrowserWindow } from "electron";

import { DiffFile } from "../../domain/entities.js";
import { RepoDiffService } from "../repo-diff-service.js";

export class RefreshRepoDiff {
  constructor(private readonly diffService: RepoDiffService) {}

  async execute(
    repositoryPath: string,
    window: BrowserWindow,
  ): Promise<(DiffFile & { staged: boolean })[]> {
    return await this.diffService.execute(repositoryPath, window);
  }
}
