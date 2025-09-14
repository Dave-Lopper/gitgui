import { ChangeEvent } from "react";

export default function TextInput({
  placeholder,
  onChange,
}: {
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      type="text"
      className="border-modern-light font-modern mr-2 h-8 rounded-sm border-1 px-2 text-white focus:border-none focus:outline-offset-0 focus:outline-sky-500 focus:outline-solid"
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}
