export class CopyAbsoluteFilePath {
  constructor() {}

  async execute(repositoryPath: string, filePath: string): Promise<void> {
    navigator.clipboard.writeText(repositoryPath + "/" + filePath);
  }
}
