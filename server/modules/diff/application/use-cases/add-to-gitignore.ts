import * as path from "path";

import { FilesRepository } from "../../../../commons/application/files-repository.js";

export class AddToGitignore {
  constructor(private readonly filesRepository: FilesRepository) {}

  async execute(repositoryPath: string, filePaths: string[]): Promise<void> {
    const gitignorePath = path.join(repositoryPath, ".gitignore");
    if (!this.filesRepository.pathExists(gitignorePath)) {
      this.filesRepository.putFile("", gitignorePath);
    }

    if (!this.filesRepository.endsWithNewLine(gitignorePath)) {
      await this.filesRepository.appendToFile(gitignorePath, "\n");
    }

    filePaths.forEach(async (filePath) => {
      await this.filesRepository.appendToFile(gitignorePath, `${filePath}\n`);
    });
  }
}
