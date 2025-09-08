import { ReactNode } from "react";

export default function Switch({
  offChild,
  on,
  onChild,
  onSwitch,
  tabIndex,
}: {
  offChild: ReactNode;
  on: boolean;
  onChild: ReactNode;
  onSwitch: () => void;
  tabIndex?: number;
}) {
  return (
    <div className="flex items-center">
      {onChild}
      <div
        className="bg-modern-dark-border relative w-12 cursor-pointer rounded-xl outline-offset-0 outline-sky-500 focus:outline-2"
        onClick={onSwitch}
        role="button"
        style={{ height: "24px" }}
        tabIndex={tabIndex || 0}
      >
        <span
          className="absolute left-0 bg-cyan-400 transition-all"
          style={{
            height: "24px",
            width: "24px",
            borderRadius: "50%",
            left: on ? "0" : "calc(100% - 24px)",
          }}
        ></span>
      </div>
      {offChild}
    </div>
  );
}
