import { useCursorClassNames } from "./hooks";
import { iconDefaultProps, IconProps } from "./types";

export default function CloseIcon({
  color = iconDefaultProps.color,
  cursor = iconDefaultProps.cursor,
  size = iconDefaultProps.size,
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
        d="M7 17L16.8995 7.10051"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7.00001L16.8995 16.8995"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
