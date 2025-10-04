import { BrowserWindow } from "electron";

import { IEventEmitter } from "../application/i-event-emitter.js";

export class ElectronEventEmitter implements IEventEmitter {
  constructor(private readonly window: BrowserWindow) {}

  send(channel: string, payload: unknown): void {
    this.window.webContents.send(channel, payload);
  }
}
