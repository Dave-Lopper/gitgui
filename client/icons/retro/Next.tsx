import { IconProps, iconDefaultProps } from "../types";

export default function NextIcon(props: IconProps = iconDefaultProps) {
  return (
    <svg
      fill={props.color}
      version="1.1"
      id="Layer_1"
      viewBox="0 0 24 24"
      xmlSpace="preserve"
      width={`${props.size}px`}
      height={`${props.size}px`}
    >
      <path d="M9,18l7-6L9,6V18z" />
    </svg>
  );
}
