import { BrowserWindow } from "electron";

import { EventChannel, IEventEmitter } from "../application/i-event-emitter.js";

export class ElectronEventEmitter implements IEventEmitter {
  constructor(private readonly window: BrowserWindow) {}

  send(channel: EventChannel, payload?: unknown): void {
    this.window.webContents.send(channel, payload);
  }
}
