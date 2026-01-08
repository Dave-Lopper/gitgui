import { DiffEntry, DiffRepresentation } from "../../domain/diff";
import { StatusEntryWithIndex } from "../../presenters/contexts/repo-tabs/context";
import { IEventBus } from "../i-event-bus";
import { IGitService } from "../i-git-service";

export class ModifyFileDiffSelection {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly gitService: IGitService,
  ) {}

  async execute(
    repositoryPath: string,
    selection: Set<string>,
    commitHash: string | undefined = undefined,
  ) {
    const tempArray: StatusEntryWithIndex[] = [];
    selection.forEach((item) => tempArray.push(JSON.parse(item)));

    await this.eventBus.emit({
      type: "DiffSelectionModified",
      payload: tempArray,
    });

    let diff: DiffEntry<DiffRepresentation> | undefined = undefined;
    if (tempArray.length === 1) {
      if (commitHash) {
        diff = await this.gitService.getCommitFileDiff(
          repositoryPath,
          commitHash,
          tempArray[0].path,
        );
      } else {
        diff = await this.gitService.getTreeFileDiff(
          repositoryPath,
          tempArray[0].path,
          tempArray[0].staged,
        );
      }
    }
    console.log({ diff, commitHash });
    await this.eventBus.emit({ type: "DiffViewed", payload: diff });
  }
}
