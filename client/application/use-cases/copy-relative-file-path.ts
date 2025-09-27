export class CopyRelativeFilePath {
  constructor() {}

  async execute(repositoryPath: string, filePath: string): Promise<void> {
    navigator.clipboard.writeText(filePath);
  }
}
