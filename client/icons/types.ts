export type IconSupportedCursors = "not-allowed" | "default" | "pointer";
export type IconProps = {
  color?: string;
  size?: number;
  cursor?: IconSupportedCursors;
};
export const iconDefaultProps: IconProps = {
  color: "#ffffff",
  size: 24,
  cursor: "default",
} as const;
