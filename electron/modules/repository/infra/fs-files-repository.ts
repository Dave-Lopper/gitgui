import fs from "node:fs/promises";

import { FilesRepository } from "../application/files-repository.js";

export class FsFilesRepository implements FilesRepository {
  async copyFolder(path: string, destination: string): Promise<void> {
    await fs.cp(path, destination, {
      recursive: true,
      preserveTimestamps: true,
      dereference: false,
      errorOnExist: false,
      force: true,
    });
  }

  async pathExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async pathsExist(paths: string[]): Promise<boolean> {
    const promises = paths.map((path) => this.pathExists(path));
    const results = await Promise.all(promises);
    return !results.includes(false);
  }

  async readFile(path: string): Promise<string> {
    return await fs.readFile(path, "utf8");
  }

  async deleteFolder(path: string): Promise<void> {
    await fs.rm(path, { recursive: true, force: true });
  }
}
