import { Branch } from "../domain/branch";
import { CommitStatus } from "../domain/commit";
import { DiffFile } from "../domain/diff";
import { Repository } from "../domain/repository";

export type RepositorySelectionDto = {
  branches: Branch[];
  commitStatus: CommitStatus;
  diff: DiffFile[];
  repository: Repository;
};
