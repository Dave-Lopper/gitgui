import { useAuthentication } from "../../headless/hooks/authentication";
import RetroLabel from "./Label";
import RetroModal from "./Modal";
import SubmitButton from "./SubmitButton";
import TextInput from "./TextInput";

export default function AuthModal({ close }: { close: () => void }) {
  const {
    authenticate,
    authenticationFailed,
    password,
    setAuthenticationFailed,
    setPassword,
    setUsername,
    username,
  } = useAuthentication(close);

  console.log({ authenticationFailed });

  return (
    <>
      {authenticationFailed && (
        <RetroModal
          close={() => setAuthenticationFailed(false)}
          modalClassname="z-99 top-5/12"
          title="Authentication failed"
        >
          <div className="flex items-center justify-center">
            <img src="error.ico" className="mr-4" />
            <RetroLabel text="AUTHENTICATION FAILED" />
          </div>
        </RetroModal>
      )}
      <RetroModal
        title="Authentication required"
        close={close}
        modalClassname="top-1/3"
      >
        <div className="flex flex-col items-start w-full">
          <RetroLabel text="Username" />
          <TextInput
            className="w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-start">
          <RetroLabel text="Password" />
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
      </RetroModal>
    </>
  );
}
