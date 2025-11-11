import { writeFileSync } from "fs";

import { ask } from "../../../commons/infra/cli.js";
import { DummyEventEmitter } from "../../../commons/infra/dummy-event-emitter.js";
import { FsFilesRepository } from "../../../commons/infra/fs-file-repository.js";
import { ShellRunner } from "../../../commons/infra/shell-command-runner.js";
import { RepositoryGitCliRunner } from "../../repository/infra/repo-git-cli-runner.js";
import { RepoStatusService } from "../../status/application/services/repo-status.js";
import { GitStatusCliRunner } from "../../status/infra/git-cli-runner.js";
import { GetRepoDiff } from "../application/services/repo-diff.js";
import { DiffCliGitRunner } from "../infra/diff-git-cli-runner.js";

async function main() {
  const repositoryPath = await ask("Please input repository path:\n");
  const filePath = await ask("\nPlease input file path:\n");

  const shellRunner = new ShellRunner();
  const repoGitRunner = new RepositoryGitCliRunner(shellRunner);
  const eventEmitter = new DummyEventEmitter();
  const repoStatusService = new RepoStatusService(
    eventEmitter,
    new GitStatusCliRunner(shellRunner),
  );
  const service = new GetRepoDiff(
    eventEmitter,
    new FsFilesRepository(),
    new DiffCliGitRunner(shellRunner),
    repoGitRunner,
    repoStatusService,
  );

  const currentBranchName = await repoGitRunner.getCurrentBranch(
    repositoryPath as string,
  );
  const currentRemote = await repoGitRunner.getCurrentRemote(
    repositoryPath as string,
  );

  const diff = await service.processFile(
    currentBranchName,
    currentRemote.name,
    repositoryPath as string,
    { path: filePath as string, status: "MODIFIED", staged: false },
  );
  writeFileSync("diff.json", JSON.stringify(diff));
}

main();
