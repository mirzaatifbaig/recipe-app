import { useState, useCallback } from "react";

export function useConfetti(options = {}) {
  const [isActive, setIsActive] = useState(false);

  const startConfetti = useCallback(() => {
    setIsActive(true);

    if (options.duration) {
      setTimeout(() => {
        setIsActive(false);
      }, options.duration);
    }
  }, [options.duration]);

  const stopConfetti = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    isActive,
    startConfetti,
    stopConfetti,
    confettiProps: {
      recycle: options.recycle ?? false,
      numberOfPieces: options.numberOfPieces ?? 200,
    },
  };
}
