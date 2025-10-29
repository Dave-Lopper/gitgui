import { Branch } from "../domain/branch";
import { File } from "../domain/diff";
import { Repository } from "../domain/repository";

export type RepositorySelectionDto = {
  branches: Branch[];
  diff: File[];
  repository: Repository;
};
