import * as path from "path";

import { FilesRepository } from "../../../../commons/application/files-repository.js";

export class AddToGitignore {
  constructor(private readonly filesRepository: FilesRepository) {}

  async execute(repositoryPath: string, filePaths: string[]): Promise<void> {
    const gitignorePath = path.join(repositoryPath, ".gitignore");
    const gitignoreExists =
      await this.filesRepository.pathExists(gitignorePath);

    if (!gitignoreExists) {
      await this.filesRepository.putFile("", gitignorePath);
    }

    const gitignoreContents =
      await this.filesRepository.readFile(gitignorePath);
    const gitignoreLines = gitignoreContents
      .split("\n")
      .map((line) => line.trim());

    if (
      filePaths.filter((filePath) => !gitignoreLines.includes(filePath))
        .length === 0
    ) {
      return;
    }

    const endsWithNewLine =
      await this.filesRepository.endsWithNewLine(gitignorePath);
    if (!endsWithNewLine) {
      await this.filesRepository.appendToFile(gitignorePath, "\n");
    }

    for (let i = 0; i < filePaths.length; i++) {
      const path = filePaths[i].trim();
      if (gitignoreLines.includes(path)) {
        continue;
      }
      await this.filesRepository.appendToFile(gitignorePath, `${path}\n`);
    }
  }
}
