import { useCursorClassNames } from "./hooks";
import { IconProps, iconDefaultProps } from "./types";

export default function OnDiskIcon({
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
        d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
        stroke={color}
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
        stroke={color}
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
