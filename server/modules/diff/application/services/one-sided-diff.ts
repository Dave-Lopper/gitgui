import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { FileStatus } from "../../../status/domain/entities";
import { DiffRepresentation, Hunk } from "../../domain/entities.js";
import { getOneSidedDiff } from "../../domain/services/differ/index.js";
import { DiffGitRunner } from "../git-runner.js";

export class OneSidedDiffService {
  constructor(
    private readonly filesRepository: FilesRepository,
    private readonly gitRunner: DiffGitRunner,
  ) {}

  async execute(
    repositoryPath: string,
    filePath: string,
    currentBranchName: string,
    status: FileStatus,
    remoteName: string,
  ): Promise<{
    diffRepresentation: DiffRepresentation;
    hunks: Hunk<DiffRepresentation>[];
  }> {
    let fileContents: string;
    if (status === "ADDED") {
      fileContents = await this.filesRepository.readFile(filePath);
    } else if (status === "REMOVED") {
      fileContents = await this.gitRunner.getHeadFileContents(
        currentBranchName,
        remoteName,
        repositoryPath,
        filePath,
      );
    } else {
      throw new Error("One sided diff should be either ADDED or REMOVED");
    }

    return getOneSidedDiff(fileContents, filePath, status);
  }
}
