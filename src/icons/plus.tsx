import { useCursorClassNames } from "./hooks";
import { IconProps, iconDefaultProps } from "./types";

export default function PlusIcon({
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
        d="M4 12H20M12 4V20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
