import path from "path";
import { fileURLToPath } from "url";

import { app, BrowserWindow, ipcMain } from "electron";

import { bootstrap as commitBootstrap } from "../../modules/commit/bootstrap.js";
import { bootstrap as repositoryBootstrap } from "../../modules/repository/bootstrap.js";

let window: Electron.BrowserWindow;
let commitUseCases: ReturnType<typeof commitBootstrap>;
let repositoryUseCases: Awaited<ReturnType<typeof repositoryBootstrap>>;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
    window.loadFile(path.join(__dirname, "../../../../dist-client/index.html"));
    window.webContents.session.clearCache();
    window.webContents.openDevTools();
  } else {
    window.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  repositoryUseCases = await repositoryBootstrap();
  commitUseCases = commitBootstrap();

  ipcMain.handle("repositories:clone", async (event, message) => {
    const res = await repositoryUseCases.cloneRepository.execute(
      message,
      window,
    );
    return res;
  });

  ipcMain.handle(
    "repositories:getBranchesForRepository",
    async (event, message) =>
      await repositoryUseCases.getBranchesForRepository.execute(
        message,
        window,
      ),
  );

  ipcMain.handle(
    "repositories:getSaved",
    async (event, message) =>
      await repositoryUseCases.getSavedRepositories.execute(window),
  );

  ipcMain.handle(
    "repositories:selectFromDisk",
    async (event, message) =>
      await repositoryUseCases.selectRepositoryFromDisk.execute(window),
  );

  ipcMain.handle(
    "repositories:selectFromSaved",
    async (event, message) =>
      await repositoryUseCases.selectRepositoryFromSaved.execute(
        message,
        window,
      ),
  );

  ipcMain.handle("commits:getHistory", async (event, message) => {
    const parsedMessage = JSON.parse(message);
    await commitUseCases.getHistory.execute(
      parsedMessage.page,
      parsedMessage.pageSize,
      parsedMessage.repositoryPath,
      window,
    );
  });
}
// app.commandLine.appendSwitch("no-sandbox");
app.commandLine.appendSwitch("disable-features", "AudioServiceOutOfProcess");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
app.whenReady().then(createWindow);
