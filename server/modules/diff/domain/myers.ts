export type Edit = {
  type: "ADDED" | "REMOVED" | "UNCHANGED";
  value: string;
};

function backtrack(trace: Map<number, number>[], a: string, b: string): Edit[] {
  let x = a.length;
  let y = b.length;
  const edits: Edit[] = [];

  for (let d = trace.length - 1; d >= 0; d--) {
    const v = trace[d];
    const k = x - y;

    let prevK;
    if (k === -d || (k !== d && (v.get(k - 1) ?? 0) < (v.get(k + 1) ?? 0))) {
      prevK = k + 1; // insertion
    } else {
      prevK = k - 1; // deletion
    }

    const prevX = v.get(prevK) ?? 0;
    const prevY = prevX - prevK;

    // Diagonal (equal chars)
    while (x > prevX && y > prevY) {
      edits.push({ type: "UNCHANGED", value: a[x - 1] });
      x--;
      y--;
    }

    if (d === 0) break;

    // Horizontal or vertical move
    if (x === prevX) {
      edits.push({ type: "ADDED", value: b[y - 1] });
      y--;
    } else {
      edits.push({ type: "REMOVED", value: a[x - 1] });
      x--;
    }
  }

  return edits.reverse();
}

function groupEdits(edits: Edit[]): Edit[] {
  const groupedEdits: Edit[] = [];
  for (let i = 0; i < edits.length; i++) {
    const edit = edits[i];
    if (i === 0) {
      groupedEdits[0] = edit;
      continue;
    }

    const lastEdit = groupedEdits[groupedEdits.length - 1];
    if (lastEdit.type == edit.type) {
      lastEdit.value.concat();
      lastEdit.value = lastEdit.value.concat(edit.value);
    } else {
      groupedEdits.push(edit);
    }
  }

  return groupedEdits;
}

export function myersDiff(a: string, b: string): Edit[] {
  let vector = new Map<number, number>();
  const max = a.length + b.length;
  const trace: Map<number, number>[] = [];

  vector.set(1, 0);

  for (let d = 0; d <= max; d++) {
    const vNext = new Map(vector);
    trace.push(vNext);

    for (let k = -d; k <= d; k += 2) {
      let x;

      if (k === -d || (k !== d && vector.get(k - 1)! < vector.get(k + 1)!)) {
        // Insertion
        x = vector.get(k + 1) ?? 0;
      } else {
        // Deletion
        x = (vector.get(k - 1) ?? 0) + 1;
      }

      let y = x - k;

      // Follow diagonal (snake)
      while (x < a.length && y < b.length && a[x] === b[y]) {
        x++;
        y++;
      }

      vNext.set(k, x);

      // Reached end
      if (x >= a.length && y >= b.length) {
        return groupEdits(backtrack(trace, a, b));
      }
    }
    vector = vNext;
  }
  throw new Error("Diff failed");
}
