import { Repository } from "../domain/repository.js";

export interface RepositoryStore {
  getSavedRepositories(): Promise<string[]>;

  saveIfNotExists(repository: Repository): Promise<void>;

  exists(repository: Repository): Promise<boolean>;

  save(repository: Repository): Promise<void>;
}
