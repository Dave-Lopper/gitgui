import path from "path";
import { fileURLToPath } from "url";

import { app, BrowserWindow, ipcMain } from "electron";

import { bootstrap } from "../application/bootstrap.js";

let window: Electron.BrowserWindow;
let useCases: Awaited<ReturnType<typeof bootstrap>>;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createWindow() {
  console.log(path.join(__dirname, "preload.js"));
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.loadURL("http://localhost:5173"); // dev URL
  window.webContents.openDevTools();

  useCases = await bootstrap();

  ipcMain.handle("repositories:clone", async (event, message) => {
    const res = await useCases.cloneRepository.execute(message, window);
    return res;
  });

  ipcMain.handle(
    "repositories:getBranchesForRepository",
    async (event, message) =>
      await useCases.getBranchesForRepository.execute(message, window),
  );

  ipcMain.handle(
    "repositories:getSaved",
    async (event, message) => await useCases.getSavedRepositories.execute(),
  );

  ipcMain.handle(
    "repositories:selectFromDisk",
    async (event, message) =>
      await useCases.selectRepositoryFromDisk.execute(window),
  );

  ipcMain.handle(
    "repositories:selectFromSaved",
    async (event, message) =>
      await useCases.selectRepositoryFromSaved.execute(message),
  );
}

app.whenReady().then(createWindow);
