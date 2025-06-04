import { useMemo } from "react";

import { useCursorClassNames } from "./hooks";
import { IconProps, iconDefaultProps } from "./types";

export default function ChevronDownIcon({
  color = iconDefaultProps.color,
  size = iconDefaultProps.size,
  cursor = iconDefaultProps.cursor,
}: IconProps) {
  const cursorClassNames = useCursorClassNames();

  return (
    <svg
      className={cursorClassNames[cursor!]}
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9999 13.9394L17.4696 8.46973L18.5303 9.53039L11.9999 16.0607L5.46961 9.53039L6.53027 8.46973L11.9999 13.9394Z"
        fill={color}
      />
    </svg>
  );
}
