import { Branch } from "../domain/branch.js";
import { Repository } from "../domain/repository.js";

export type RepositorySelectionDto = {
  repository: Repository;
  branches: Branch[];
};
