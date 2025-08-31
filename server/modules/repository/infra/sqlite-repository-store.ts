import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

import { RepositoryStore } from "../application/store.js";
import { Repository } from "../domain/entities.js";

export class SqliteRepositoryStore implements RepositoryStore {
  private database: Database;
  constructor(database: Database) {
    this.database = database;
  }

  static async create(): Promise<SqliteRepositoryStore> {
    return new SqliteRepositoryStore(
      await open({ filename: "./db.sqlite3", driver: sqlite3.Database }),
    );
  }

  async getSavedRepositories(): Promise<string[]> {
    const results = await this.database.all("select * from repositories");
    return results
      .map((r) => r.local_path)
      .filter((_) => _ && typeof _ === "string");
  }

  async exists(repository: Repository): Promise<boolean> {
    const existingRepo = await this.database.get(
      "select * from repositories where local_path = ?",
      repository.localPath,
    );
    return existingRepo !== undefined;
  }

  async save(repository: Repository): Promise<void> {
    await this.database.run(
      "insert into repositories(local_path) values(:local_path);",
      {
        ":local_path": repository.localPath,
      },
    );
  }

  async saveIfNotExists(repository: Repository): Promise<void> {
    const existingRepo = await this.database.get(
      "select * from repositories where name = ?",
      repository.name,
    );
    if (existingRepo !== undefined) {
      return;
    }

    await this.database.run(
      "insert into repositories(local_path) values(:local_path);",
      {
        ":local_path": repository.localPath,
      },
    );
  }
}
