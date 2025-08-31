import { useCallback, useRef, useState } from "react";

import { RepositorySelection } from "../../types";

export default function CloneInput({
  callback,
}: {
  callback: (repository: RepositorySelection) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInvalidUrl, setIsInvalidUrl] = useState(false);

  const handleClick = useCallback(async () => {
    const url = inputRef?.current?.value;
    if (!url || !url.startsWith("https://")) {
      setIsInvalidUrl(true);
      return;
    }
    const results = await window.electronAPI.cloneRepository(url);
    setIsInvalidUrl(false);

    if (results.success) {
      callback(results.data);
    }
  }, []);

  return (
    <div className="flex w-full pr-15 pl-15 flex-col m-auto">
      <label className="mb-4">Please paste the URL of the repository</label>
      <div className="flex items-center justify-start">
        <input
          type="text"
          name="repository-url"
          className={`mr-4 h-12 w-full rounded-md bg-stone-700 p-2 ${isInvalidUrl && "border-1 border-red-700"}`}
          ref={inputRef}
        />

        <button onClick={handleClick}>Ok!</button>
      </div>
      {isInvalidUrl && <p className="mt-3 text-sm text-red-700">Invalid url</p>}
    </div>
  );
}
