export function parseFileNumStat(line: string): number[] {
  const matches = line.trimEnd().match(/^([\d-]+)\s+([\d-]+)\s+(.+)$/);
  if (!matches) {
    throw new Error(`Numstat line unexpectedly formed: ${line}`);
  }

  const [, added, removed, _] = matches;
  return [parseInt(added), parseInt(removed)];
}
