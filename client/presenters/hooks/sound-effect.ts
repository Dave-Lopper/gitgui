import { use, useCallback, useContext, useEffect, useRef } from "react";

import { UiSettingsContext } from "../contexts/ui-settings/context";

const soundEffectsMapping = {
  MAXIMIZE: {
    RETRO: "sound/retro/maximize.mp3",
    MODERN: "sound/modern/maximize.mp3",
  },
  MINIMIZE: {
    RETRO: "sound/retro/minimize.mp3",
    MODERN: "sound/modern/minimize.mp3",
  },
} as const;
export type SoundEffect = keyof typeof soundEffectsMapping;

export function useSoundEffect(effect: SoundEffect) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isSoundEnabled, theme } = useContext(UiSettingsContext);

  useEffect(() => {
    audioRef.current = new Audio(soundEffectsMapping[effect][theme]);
  }, [effect, theme]);

  const play = () => {
    console.log({ isSoundEnabled });
    if (isSoundEnabled) {
      audioRef.current?.play();
    }
  };

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, pause, stop, audio: audioRef.current };
}
