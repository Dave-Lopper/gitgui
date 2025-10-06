import { LabelProps } from "../../headless/types";

export default function RetroLabel({ text }: LabelProps) {
  return <label className="font-retro text-black text-md">{text}</label>;
}
