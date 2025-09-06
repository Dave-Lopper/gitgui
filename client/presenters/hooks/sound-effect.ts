import { useCallback, useRef } from "react";

import { Theme } from "../../application/theme";

const soundEffectsMapping = {
  MAXIMIZE: { RETRO: "maximize.mp3", MODERN: "maximize.mp3" },
  MINIMIZE: { RETRO: "minimize.mp3", MODERN: "minimize.mp3" },
} as const;
export type SoundEffect = keyof typeof soundEffectsMapping;

export function useSoundEffect(effect: SoundEffect, theme: Theme) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(soundEffectsMapping[effect][theme]);
  }

  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

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
