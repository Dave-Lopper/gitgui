import { useCallback, useContext, useEffect, useRef } from "react";

import { UiSettingsContext } from "../../contexts/ui-settings/context";
import retroMaximize from "/sound/retro/maximize.mp3";

const soundModules = import.meta.glob("/sound/**/*.mp3", {
  eager: true,
  as: "url",
});

const soundEffectsMapping = {
  MAXIMIZE: {
    RETRO: "sound/retro/maximize.wav",
    MODERN: "sound/retro/maximize.wav",
  },
  MINIMIZE: {
    RETRO: "sound/retro/minimize.mp3",
    MODERN: "sound/modern/minimize.mp3",
  },
  SWITCH: {
    RETRO: "sound/retro/switch.mp3",
    MODERN: "sound/modern/switch.mp3",
  },
  BUTTON_PRESSED: {
    RETRO: "sound/retro/button-pressed.mp3",
    MODERN: "sound/modern/button-pressed.mp3",
  },
  BUTTON_DISABLED: {
    RETRO: "sound/retro/button-disabled.mp3",
    MODERN: "sound/modern/button-disabled.mp3",
  },
} as const;
export type SoundEffect = keyof typeof soundEffectsMapping;

export function useSoundEffect(effect: SoundEffect) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isSoundEnabled, theme } = useContext(UiSettingsContext);

  useEffect(() => {
    audioRef.current = new Audio(soundEffectsMapping[effect][theme]);
  }, [effect, theme]);

  const play = useCallback(() => {
    console.log(
      "PLAYING",
      audioRef.current,
      audioRef.current?.volume,
      audioRef.current?.muted,
      audioRef.current?.currentSrc,
    );
    if (isSoundEnabled) {
      audioRef.current?.play();
    }
  }, [audioRef.current, isSoundEnabled]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, [audioRef.current]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioRef.current]);

  return { play, pause, stop, audio: audioRef.current };
}
