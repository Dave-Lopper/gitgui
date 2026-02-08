import { DiffRepresentation, Hunk, getLineContents } from "../../domain/diff";

export class CopyDiffHunk {
  constructor() {}

  async execute(hunk: Hunk<DiffRepresentation>): Promise<void> {
    let hunkContent = "";
    for (let i = 0; i < hunk.lines.length; i++) {
      hunkContent = hunkContent += getLineContents(hunk.lines[i]) + "\n";
    }
    navigator.clipboard.writeText(hunkContent);
  }
}
