import { useMemo } from "react";

export const useCursorClassNames = () =>
  useMemo(
    () => ({
      default: "cursor-default",
      pointer: "cursor-pointer",
      "not-allowed": "cursor-not-allowed",
    }),
    [],
  );
