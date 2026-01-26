import { DiffLine, getLineContents } from "../../domain/diff";

export class CopyDiffLine {
  constructor() {}

  async execute(line: DiffLine): Promise<void> {
    const content = getLineContents(line);
    navigator.clipboard.writeText(content);
  }
}
