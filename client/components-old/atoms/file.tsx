import { useEffect, useState } from "react";
import { getDiffFileName, FileDiff } from "../../types";

export default function File({
  bgColor,
  currentFile,
  file,
  setCurrentFile,
}: {
  bgColor: string;
  currentFile?: FileDiff;
  file: FileDiff;
  setCurrentFile: (file: FileDiff) => void;
}) {
  const [isChecked, setIsChecked] = useState(file.staged);
  useEffect(() => {
    // Call backend
  }, [isChecked]);

  return (
    <div
      key={file.newPath + file.oldPath}
      className={`flex cursor-pointer items-center transition-colors ${file === currentFile && "bg-stone-600"} border-b-1 border-b-white hover:bg-stone-600`}
      onClick={() => file !== currentFile && setCurrentFile(file)}
    >
      <div
        className="ml-4"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: bgColor,
          borderRadius: "50%",
        }}
      ></div>
      <input
        type="checkbox"
        className="ml-4 cursor-pointer"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <div className="p-2 pl-4 text-left text-sm">{getDiffFileName(file)}</div>
    </div>
  );
}
