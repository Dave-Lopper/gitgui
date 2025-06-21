import { GitError } from "../../types";
import { CloseIcon } from "../../icons";

export default function ErrorPopup({
  errors,
  hide,
}: {
  errors: GitError[];
  hide: () => void;
}) {
  return (
    <div
      className="absolute z-10 h-full w-full bg-white/15"
      // style={{ transform: "translate(50%, 50%)" }}
    >
      <div className="absolute left-1/8 flex w-3/4 flex-col items-center justify-center rounded-md border-1 border-stone-400 bg-stone-800 p-5">
        <div className="absolute top-4 right-4 cursor-pointer" onClick={hide}>
          <CloseIcon cursor="pointer" />
        </div>
        <p className="text-md">Git error occured</p>
        <div className="mt-5 flex w-4/5 flex-col items-start">
          <p className="text-md">Errors:</p>
          <div className="w-full rounded-md bg-stone-600 p-4 font-[consolas]">
            {errors.map((error) => (
              <div className="mt-2 flex flex-col items-start">
                <p>command: {error.command || "unknown-command"}</p>
                <p>output: {error.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
