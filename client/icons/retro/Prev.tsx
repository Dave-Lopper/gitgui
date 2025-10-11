import { IconProps, iconDefaultProps } from "../types";

export default function PrevIcon(props: IconProps = iconDefaultProps) {
  return (
    <svg
      fill={props.color}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 24 24"
      xmlSpace="preserve"
      width={`${props.size}px`}
      height={`${props.size}px`}
    >
      <path d="M15,6l-7,6l7,6V6z" fill={props.color} />
    </svg>
  );
}
