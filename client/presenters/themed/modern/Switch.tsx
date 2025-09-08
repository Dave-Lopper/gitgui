import { KeyboardEvent, ReactNode, useCallback, useRef } from "react";

import { useSoundEffect } from "../../headless/hooks/sound-effect";

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
  const switchSoundEffect = useSoundEffect("SWITCH");
  const switchRef = useRef<HTMLDivElement>(null);
  const performSwitch = useCallback(() => {
    switchSoundEffect.play();
    onSwitch();
  }, []);
  const handleKeywDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (!switchRef.current || e.key !== "Enter") {
      return;
    }
    if (switchRef.current === document.activeElement) {
      performSwitch();
    }
  }, []);

  return (
    <div className="flex items-center">
      {onChild}
      <div
        className="bg-modern-dark-border relative w-12 cursor-pointer rounded-xl outline-offset-0 outline-sky-500 focus:outline-2"
        onClick={performSwitch}
        onKeyDown={handleKeywDown}
        role="button"
        ref={switchRef}
        style={{ height: "24px" }}
        tabIndex={tabIndex || 0}
      >
        <span
          className="absolute left-0 transition-all"
          style={{
            height: "24px",
            width: "24px",
            borderRadius: "50%",
            left: on ? "0" : "calc(100% - 24px)",
            background:
              "linear-gradient(180deg, #ffffff88, #00000022), linear-gradient(145deg, #4fc3f7, #0288d1)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        ></span>
      </div>
      {offChild}
    </div>
  );
}
