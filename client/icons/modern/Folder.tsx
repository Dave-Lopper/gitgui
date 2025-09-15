import { iconDefaultProps, IconProps } from "../types";

export default function FolderIcon(props: IconProps = iconDefaultProps) {
  return (
    <svg
      width={`${props.size}px`}
      height={`${props.size}px`}
      fill={props.color}
      viewBox="0 0 24 24"
      transform=""
    >
      <path d="m20,4h-8.59l-1.41-1.41c-.38-.38-.88-.59-1.41-.59h-4.59c-1.1,0-2,.9-2,2v14c0,1.1.9,2,2,2h16c1.1,0,2-.9,2-2V6c0-1.1-.9-2-2-2Zm0,14H4s0-12,0-12h16v12Z"></path>
    </svg>
  );
}
