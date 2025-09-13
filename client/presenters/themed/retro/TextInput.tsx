import { ChangeEvent } from "react";

export default function TextInput({
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      className="retro-borders-in font-retro h-8 border-2 bg-white text-lg text-black focus:outline-none"
      type="text"
      onChange={onChange}
    />
  );
}
