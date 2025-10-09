import { useCallback, useState } from "react";

import { useCases } from "../../../bootstrap";
import { useEventSubscription } from "../../../infra/react-bus-helper";
import { useRepositorySelection } from "./repository-selection";
import { useSoundEffect } from "./sound-effect";

export function useAuthentication(authCallback: () => void) {
  const errorSoundEffect = useSoundEffect("ERROR");
  const successSoundEffect = useSoundEffect("SUCCESS");
  const { repositorySelection } = useRepositorySelection();
  const [authenticationFailed, setAuthenticationFailed] = useState(false);
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const authenticate = useCallback(async () => {
    if (!repositorySelection || !password || !username) {
      return;
    }
    setIsLoading(true);
    await useCases.authenticate.execute(
      password,
      repositorySelection.repository.localPath,
      username,
    );
  }, [repositorySelection, password, username]);

  useEventSubscription(
    "Authenticated",
    async (event) => {
      setIsLoading(false);
      successSoundEffect.play();
      if (event.payload.success === true) {
        if (repositorySelection?.repository) {
          await useCases.selectRepositoryFromSaved.execute(
            repositorySelection?.repository.localPath,
          );
        }
        authCallback();
      } else {
        errorSoundEffect.play();
        setAuthenticationFailed(true);
      }
    },
    [close, repositorySelection],
  );

  return {
    authenticate,
    authenticationFailed,
    isLoading,
    password,
    setAuthenticationFailed,
    setPassword,
    setUsername,
    username,
  };
}
