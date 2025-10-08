import { ComponentType, useCallback, useState } from "react";

import { useCases } from "../../bootstrap";
import { useEventSubscription } from "../../infra/react-bus-helper";
import { useRepositorySelection } from "./hooks/repository-selection";
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
  const { repositorySelection } = useRepositorySelection();
  const [authenticationFailed, setAuthenticationFailed] = useState(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  const authenticate = useCallback(async () => {
    if (!repositorySelection || !password || !username) {
      return;
    }
    await useCases.authenticate.execute(
      password,
      repositorySelection.repository.localPath,
      username,
    );
  }, [repositorySelection, password, username]);

  useEventSubscription(
    "Authenticated",
    async (event) => {
      if (event.payload.success === true) {
        if (repositorySelection?.repository) {
          await useCases.selectRepositoryFromSaved.execute(
            repositorySelection?.repository.localPath,
          );
        }
        close();
      } else {
        setAuthenticationFailed(true);
      }
    },
    [close],
  );

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
        onClick={authenticate}
      />
    </Modal>
  );
}
