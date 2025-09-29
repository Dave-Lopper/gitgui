import { Branch } from "../domain/branch";
import { DiffFile } from "../domain/diff";
import { Repository } from "../domain/repository";

export type RepositorySelectionDto = {
  branches: Branch[];
  diff: DiffFile[];
  repository: Repository;
};
