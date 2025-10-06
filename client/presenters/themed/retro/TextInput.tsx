import { TextInputProps } from "../../headless/types";

export default function TextInput({
  className,
  onChange,
  placeholder,
  secret,
}: TextInputProps) {
  return (
    <input
      className={`retro-borders-in font-retro h-8 border-2 bg-white text-lg text-black p-[4px] focus:outline-none ${
        className ? className : ""
      }`}
      type={secret ? "password" : "text"}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
