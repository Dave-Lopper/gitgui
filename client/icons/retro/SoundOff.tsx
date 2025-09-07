import { iconDefaultProps, IconProps } from "../types";

export default function RetroSoundOffIcon(props: IconProps = iconDefaultProps) {
  return (
    <svg
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 16V8H6L11 4V20L6 16H3Z"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 15L20.5 9"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9L20.5 15"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
