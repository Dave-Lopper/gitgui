import { Repository } from "../domain/entities.js";

export interface RepositoryStore {
  getSavedRepositories(): Promise<string[]>;

  saveIfNotExists(repository: Repository): Promise<void>;

  exists(repository: Repository): Promise<boolean>;

  save(repository: Repository): Promise<void>;
}
