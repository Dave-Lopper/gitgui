import { iconDefaultProps, IconProps } from "../types";

export default function SoundOnRetroIcon(props: IconProps = iconDefaultProps) {
  return (
    <svg
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 16V8H6L11 4V20L6 16H3Z"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 9C13 9 15 9.5 15 12C15 14.5 13 15 13 15"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 7C15 7 18 7.83333 18 12C18 16.1667 15 17 15 17"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 5C17 5 21 6.16667 21 12C21 17.8333 17 19 17 19"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
