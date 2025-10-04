import { iconDefaultProps, IconProps } from "../types";

export default function ArrowUpIcon(props: IconProps = iconDefaultProps) {
  return (
    <svg
      width={`${props.size}px`}
      height={`${props.size}px`}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 8L2 8L2 6L8 5.24536e-07L14 6L14 8L10 8L10 16L6 16L6 8Z"
        fill={props.color}
      />
    </svg>
  );
}
