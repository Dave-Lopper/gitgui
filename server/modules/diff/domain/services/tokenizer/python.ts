export type PythonStringMarkers = "'" | 'f"' | '"' | 'r"' | 'b"';

function isStringMarker(value: string): boolean {
  return (
    value.startsWith("'") ||
    value.startsWith('f"') ||
    value.startsWith('"') ||
    value.startsWith('r"') ||
    value.startsWith('b"')
  );
}
