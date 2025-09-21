export interface FilesRepository {
  appendToFile(path: string, content: string): Promise<void>;

  copyFolder(path: string, destination: string): Promise<void>;

  endsWithNewLine(path: string): Promise<boolean>;

  getLastModifiedTime(filePath: string): Promise<Date>;

  pathExists(path: string): Promise<boolean>;

  pathsExist(paths: string[]): Promise<boolean>;

  putFile(content: string, path: string): Promise<void>;

  readFile(path: string): Promise<string>;

  deleteFolder(path: string): Promise<void>;
}
