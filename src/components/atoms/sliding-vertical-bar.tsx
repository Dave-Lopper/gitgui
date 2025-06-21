import { useMemo } from "react";

export default function SlidingVerticalBar({
  children,
  position,
  show,
}: {
  children: React.ReactNode;
  show: boolean;
  position: "left" | "right";
}) {
  const leftClass = useMemo(
    () => (position === "right" ? "left-1/2" : "left-0"),
    [position],
  );
  const borderClass = useMemo(
    () => (position === "right" ? "border-l-1" : "border-r-1"),
    [position],
  );

  return (
    <div
      className={`absolute top-22 bottom-0 ${leftClass} flex w-1/2 flex-col ${borderClass} overflow-y-auto border-white bg-stone-800 transition-transform`}
      style={{
        transformOrigin: "top",
        transform: `scaleY(${show ? 1 : 0})`,
      }}
    >
      {children}
    </div>
  );
}
