import { ComponentType, useState } from "react";

import { LabelProps, SubmitButtonProps, TextInputProps } from "./types";

type AuthModalProps = {
  modalClassname?: string;
  label: ComponentType<LabelProps>;
  submitButton: ComponentType<SubmitButtonProps>;
  textInput: ComponentType<TextInputProps>;
};

export default function AuthModal({
  label: Label,
  modalClassname,
  submitButton: SubmitButton,
  textInput: TextInput,
}: AuthModalProps) {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  return (
    <div className={`absolute ${modalClassname ? modalClassname : ""}`}>
      <Label text="Username" />
      <TextInput
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Label text="Password" />
      <TextInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        secret
      />
      <SubmitButton
        disabled={!username && !password}
        text="Authenticate"
        onClick={async () => console.log("Auth")}
      />
    </div>
  );
}
