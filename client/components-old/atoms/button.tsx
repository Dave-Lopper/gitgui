import { ReactNode, useCallback, MouseEvent } from "react";

export type ButtonCallback =
  | ((evt?: MouseEvent) => void)
  | (() => void)
  | ((evt?: MouseEvent) => Promise<void>)
  | (() => Promise<void>);

export default function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: ButtonCallback;
}) {
  const handleClick = useCallback(
    async (evt: MouseEvent) => {
      await onClick(evt);
    },
    [onClick],
  );
  return (
    <div
      className="cursor-pointer rounded-md bg-stone-700 pt-2 pr-6 pb-2 pl-6 transition-colors hover:bg-stone-600"
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
