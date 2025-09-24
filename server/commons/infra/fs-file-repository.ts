import fs from "node:fs/promises";

import { FilesRepository } from "../application/files-repository.js";

export class FsFilesRepository implements FilesRepository {
  async appendToFile(path: string, content: string): Promise<void> {
    await fs.appendFile(path, content);
  }

  async copyFolder(path: string, destination: string): Promise<void> {
    await fs.cp(path, destination, {
      recursive: true,
      preserveTimestamps: true,
      dereference: false,
      errorOnExist: false,
      force: true,
    });
  }

  async endsWithNewLine(path: string): Promise<boolean> {
    const stats = await fs.stat(path);
    if (stats.size === 0) {
      return true;
    }

    const fileHandle = await fs.open(path, "r");
    const buffer = Buffer.alloc(1);
    await fileHandle.read(buffer, 0, 1, stats.size - 1);
    await fileHandle.close();

    if (buffer[0] !== 10) {
      return false;
    }

    return true;
  }

  async pathExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async putFile(content: string, path: string): Promise<void> {
    await fs.writeFile(path, content);
  }

  async getLastModifiedTime(filePath: string): Promise<Date> {
    const stats = await fs.stat(filePath);
    return stats.mtime;
  }

  async pathsExist(paths: string[]): Promise<boolean> {
    const promises = paths.map((path) => this.pathExists(path));
    const results = await Promise.all(promises);
    return !results.includes(false);
  }

  async readFile(path: string): Promise<string> {
    return await fs.readFile(path, "utf8");
  }

  async removeFile(path: string): Promise<void> {
    await fs.rm(path);
  }

  async deleteFolder(path: string): Promise<void> {
    await fs.rm(path, { recursive: true, force: true });
  }
}
