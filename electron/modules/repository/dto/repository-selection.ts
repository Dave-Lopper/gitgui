import { Repository } from "../domain/repository.js";

export type RepositorySelectionDto = {
  repository: Repository;
  branches: string[];
};
