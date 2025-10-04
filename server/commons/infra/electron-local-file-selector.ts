import * as os from "os";

import { BrowserWindow, dialog } from "electron";

import {
  ILocalFilePathSelector,
  LocalFilePathSelection,
} from "../application/i-file-selector";

export class ElectronLocalFilePathSelector implements ILocalFilePathSelector {
  private window: BrowserWindow;

  constructor(window: BrowserWindow) {
    this.window = window;
  }

  async selectPath(
    defaultPath: string = os.homedir(),
  ): Promise<LocalFilePathSelection> {
    const result: any = await dialog.showOpenDialog(this.window, {
      properties: ["openDirectory"],
      defaultPath,
    });

    if (result.canceled) {
      return {
        status: "CANCELED",
      };
    }

    return { status: "COMPLETED", paths: result.filePaths };
  }
}
