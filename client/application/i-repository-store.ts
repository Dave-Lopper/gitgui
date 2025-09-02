import { Repository } from "../domain/repository";

export interface IRepositoryStore {
  getRepositories(): Promise<Repository[]>;
}
