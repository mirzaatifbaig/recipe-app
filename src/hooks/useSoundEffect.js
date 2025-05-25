import { useRef, useCallback } from "react";
import { Howl } from "howler";

const defaultSounds = {
  success: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
  click: "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3",
  complete: "https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3",
  timer: "https://assets.mixkit.co/active_storage/sfx/1862/1862-preview.mp3",
  toggle: "https://assets.mixkit.co/active_storage/sfx/233/233-preview.mp3",
};

export function useSoundEffect(customSounds) {
  const soundsRef = useRef({});
  const sounds = { ...defaultSounds, ...customSounds };

  // Lazy-load sound files
  const getSound = useCallback(
    (id) => {
      if (!soundsRef.current[id] && sounds[id]) {
        soundsRef.current[id] = new Howl({
          src: [sounds[id]],
          html5: true,
          preload: false,
        });
      }
      return soundsRef.current[id];
    },
    [sounds],
  );

  const play = useCallback(
    (id, volume = 0.5) => {
      try {
        const sound = getSound(id);
        if (sound) {
          sound.volume(volume);
          sound.play();
        }
      } catch (err) {
        console.error("Error playing sound:", err);
      }
    },
    [getSound],
  );

  const stop = useCallback((id) => {
    const sound = soundsRef.current[id];
    if (sound) {
      sound.stop();
    }
  }, []);

  return { play, stop };
}
