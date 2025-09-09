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
        style={{
          boxShadow:
            "inset 2px 2px 4px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(105,105,105,0.6)",
          height: "24px",
        }}
        onClick={performSwitch}
        onKeyDown={handleKeywDown}
        role="button"
        ref={switchRef}
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
              "radial-gradient(circle at 30% 30%, #ffffff 0%, #dddddd 30%, #aaaaaa 100%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        ></span>
      </div>
      {offChild}
    </div>
  );
}
