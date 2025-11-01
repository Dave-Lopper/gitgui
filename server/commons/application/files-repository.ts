export interface FilesRepository {
  appendToFile(path: string, content: string): Promise<void>;

  copyFolder(path: string, destination: string): Promise<void>;

  countLines(path: string): Promise<number>;

  endsWithNewLine(path: string): Promise<boolean>;

  getLastModifiedTime(filePath: string): Promise<Date>;

  isFile(path: string): Promise<boolean>;

  pathExists(path: string): Promise<boolean>;

  pathsExist(paths: string[]): Promise<boolean>;

  putFile(content: string, path: string): Promise<void>;

  readFile(path: string): Promise<string>;

  removeFile(path: string): Promise<void>;

  deleteFolder(path: string): Promise<void>;
}
