import { DiffFile } from "../domain/diff";
import { Branch } from "../domain/branch";
import { Repository } from "../domain/repository";

export type RepositorySelectionDto = {
  repository: Repository;
  branches: Branch[];
  diff: DiffFile[];
};
