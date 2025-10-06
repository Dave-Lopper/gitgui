import { ComponentType, useState } from "react";

import {
  LabelProps,
  ModalProps,
  SubmitButtonProps,
  TextInputProps,
} from "./types";

type AuthModalProps = {
  close: () => void;
  modal: ComponentType<ModalProps>;
  label: ComponentType<LabelProps>;
  submitButton: ComponentType<SubmitButtonProps>;
  textInput: ComponentType<TextInputProps>;
};

export default function AuthModal({
  close,
  label: Label,
  modal: Modal,
  submitButton: SubmitButton,
  textInput: TextInput,
}: AuthModalProps) {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  return (
    <Modal close={close} title="Authentication required">
      <div className="flex flex-col items-start w-full">
        <Label text="Username" />
        <TextInput
          className="w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col items-start">
        <Label text="Password" />
        <TextInput
          className="w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          secret
        />
      </div>
      <SubmitButton
        disabled={!username && !password}
        text="Authenticate"
        onClick={async () => console.log("Auth")}
      />
    </Modal>
  );
}
