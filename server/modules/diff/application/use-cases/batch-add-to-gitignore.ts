import * as path from "path";

import { FilesRepository } from "../../../../commons/application/files-repository.js";

export class BatchAddToGitignore {
  constructor(private readonly filesRepository: FilesRepository) {}

  async execute(repositoryPath: string, extension: string): Promise<void> {
    const gitignorePath = path.join(repositoryPath, ".gitignore");
    const gitignoreExists =
      await this.filesRepository.pathExists(gitignorePath);
    const lineToAdd = `*.${extension}`;

    if (!gitignoreExists) {
      await this.filesRepository.putFile("", gitignorePath);
    }

    const gitignoreContents =
      await this.filesRepository.readFile(gitignorePath);
    const gitignoreLines = gitignoreContents
      .split("\n")
      .map((line) => line.trim());

    if (
      gitignoreLines.includes(lineToAdd) ||
      gitignoreLines.includes(`${lineToAdd}\n`)
    ) {
      return;
    }

    const endsWithNewLine =
      await this.filesRepository.endsWithNewLine(gitignorePath);
    if (!endsWithNewLine) {
      await this.filesRepository.appendToFile(gitignorePath, "\n");
    }

    await this.filesRepository.appendToFile(gitignorePath, `${lineToAdd}\n`);
  }
}
