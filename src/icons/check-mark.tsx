import { IconProps, iconDefaultProps } from "./types";
import { useCursorClassNames } from "./hooks";

export default function CheckMarkIcon({
  size = iconDefaultProps.size,
  cursor = iconDefaultProps.cursor,
  color = iconDefaultProps.color,
}: IconProps) {
  const cursorClassNames = useCursorClassNames();
  return (
    <svg
      fill={color}
      className={cursorClassNames[cursor!]}
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 1920 1920"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z"
        fillRule="evenodd"
      />
    </svg>
  );
}
