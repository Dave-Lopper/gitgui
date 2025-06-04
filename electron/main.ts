import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

import { app, BrowserWindow, dialog, ipcMain } from "electron";
import ini from "ini";
import sqlite3 from "sqlite3";

import {
  getBranchName,
  getBranchesForRepository,
  isValidGitRepository,
} from "./utils.js";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window: Electron.BrowserWindow;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const database = new sqlite3.Database("./db.sqlite3", (err) => {
  if (err) {
    console.error("Database opening error: ", err);
    throw err;
  }
});

function createWindow() {
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
}

app.whenReady().then(createWindow);

const handleInit = async (
  event: Electron.IpcMainEvent,
  window: Electron.BrowserWindow,
) => {
  database.all("select * from repositories", async (err, rows) => {
    const returnValue: any = {
      action: "init",
      status: err === null ? "success" : "error",
    };
    if (err === null) {
      returnValue.savedRepositories = [];
      for (let i = 0; i < rows.length; i++) {
        const row: any = rows[i];
        returnValue.savedRepositories.push({
          ...row,
          branch_name: await getBranchName(row.local_path),
        });
      }
    } else {
      returnValue.message = err.message;
    }
    event.sender.send("fromMain", [JSON.stringify(returnValue)]);
  });
};

const handleLocalRepoSelection = async (
  event: Electron.IpcMainEvent,
  window: Electron.BrowserWindow,
) => {
  const result: any = await dialog.showOpenDialog(window, {
    properties: ["openDirectory"],
    defaultPath: os.homedir(),
  });
  if (result.canceled) {
    event.sender.send("fromMain", [
      JSON.stringify({ action: "localRepoSelection", status: "canceled" }),
    ]);
    return;
  }

  const selectedPath = result.filePaths[0];
  if (!(await isValidGitRepository(selectedPath))) {
    event.sender.send("fromMain", [
      JSON.stringify({ action: "localRepoSelection", status: "invalidRepo" }),
    ]);
    return;
  }

  const repositoryName = path.basename(selectedPath);
  const gitFolder = path.join(selectedPath, ".git");
  const branchName = await getBranchName(selectedPath);

  const rawConfig = fs.readFileSync(path.join(gitFolder, "config"), "utf-8");
  const config = ini.parse(rawConfig);

  const remoteKeys = Object.keys(config).filter((key) =>
    key.startsWith("remote"),
  );
  if (remoteKeys.length > 1) {
    throw new Error("More than 1 remote");
  }
  let remoteName: string | undefined;
  if (remoteKeys.length !== 1) {
    throw new Error("Issue: more than one remote");
  }
  const remoteKey = remoteKeys[0];
  const regex = /remote\s+"([^"]+)"/;
  const match = remoteKey.match(regex);
  if (match) {
    remoteName = match[1];
  }

  const remote = config[remoteKey];
  const repositoryUrl = remote.url;

  database.get(
    "select name, url from repositories where name = ?",
    [repositoryName],
    (err, row) => {
      if (!row) {
        database.run(
          "insert into repositories (name, url, remote_name, local_path) values (:name, :url, :remote_name, :local_path)",
          {
            ":name": repositoryName,
            ":url": repositoryUrl,
            ":remote_name": remoteName,
            ":local_path": selectedPath,
          },
        );
      }
    },
  );

  event.sender.send("fromMain", [
    JSON.stringify({
      action: "localRepoSelection",
      status: "success",
      localPath: selectedPath,
      branchName,
      repositoryName,
      repositoryUrl,
      remoteName,
    }),
  ]);
};

ipcMain.on("toMain", async (event, message) => {
  if (message === "init") {
    await handleInit(event, window);
  }
  if (message === "localRepoSelection") {
    await handleLocalRepoSelection(event, window);
  }
});

ipcMain.on("getBranchesForRepository", async (event, message) => {
  const parsedMessage = JSON.parse(message);
  const branches = await getBranchesForRepository(
    parsedMessage.repositoryPath,
    parsedMessage.remoteName,
  );
  event.sender.send("fromMain", [
    JSON.stringify({
      action: "getBranchesForRepository",
      status: "success",
      repositoryPath: parsedMessage.repositoryPath,
      remoteName: parsedMessage.remoteName,
      branches,
    }),
  ]);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
