import { FilesRepository } from "../../../../commons/application/files-repository.js";
import { IEventEmitter } from "../../../../commons/application/i-event-emitter.js";
import { safeGit } from "../../../../commons/application/safe-git.js";
import { FileStatus } from "../../../status/domain/entities.js";
import { DiffEntry, DiffRepresentation, Hunk } from "../../domain/entities.js";
import { parseFilePatch } from "../../domain/services/differ/index.js";
import { parseFileNumStat } from "../../domain/services/numstats.js";
import { DiffGitRunner } from "../git-runner.js";
import { OneSidedDiffService } from "../services/one-sided-diff.js";

export class GetTreeFileDiff {
  private readonly oneSidedDiffService: OneSidedDiffService;

  constructor(
    private readonly eventEmitter: IEventEmitter,
    private readonly filesRepository: FilesRepository,
    private readonly gitRunner: DiffGitRunner,
  ) {
    this.oneSidedDiffService = new OneSidedDiffService(
      filesRepository,
      gitRunner,
    );
  }

  async execute(
    repositoryPath: string,
    filePath: string,
    currentBranchName: string,
    remoteName: string,
    staged: boolean,
    status: FileStatus,
  ): Promise<DiffEntry<DiffRepresentation>> {
    let hunks: Hunk<DiffRepresentation>[];
    let representation: DiffRepresentation;
    let numstat: number[] | undefined = undefined;
    if (status == "ADDED") {
      numstat = [await this.filesRepository.countLines(filePath), 0];
      const parsed = await this.oneSidedDiffService.execute(
        repositoryPath,
        filePath,
        currentBranchName,
        status,
        remoteName,
      );
      hunks = parsed.hunks;
      representation = parsed.diffRepresentation;
    } else if (status === "REMOVED") {
      const fileContents = await safeGit(
        this.gitRunner.getHeadFileContents(
          currentBranchName,
          remoteName,
          repositoryPath,
          filePath,
        ),
        this.eventEmitter,
      );
      numstat = [0, fileContents.split("\n").length];
      const parsed = await this.oneSidedDiffService.execute(
        repositoryPath,
        filePath,
        currentBranchName,
        status,
        remoteName,
      );
      hunks = parsed.hunks;
      representation = parsed.diffRepresentation;
    } else {
      const numstatLines = await safeGit(
        this.gitRunner.getFileNumStats(repositoryPath, filePath, staged),
        this.eventEmitter,
      );
      numstat = parseFileNumStat(numstatLines);

      const rawPatch = await safeGit(
        this.gitRunner.getFilePatch(repositoryPath, filePath, staged),
        this.eventEmitter,
      );
      const parsed = parseFilePatch(filePath, rawPatch);
      hunks = parsed.hunks;
      representation = parsed.diffRepresentation;
    }

    return {
      numStat:
        numstat !== undefined
          ? { added: numstat[0], removed: numstat[1] }
          : null,
      representation,
      hunks,
    };
  }
}
