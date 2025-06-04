export interface FilesRepository {
  copyFolder(path: string, destination: string): Promise<void>;

  pathExists(path: string): Promise<boolean>;

  pathsExist(paths: string[]): Promise<boolean>;

  readFile(path: string): Promise<string>;

  deleteFolder(path: string): Promise<void>;
}
