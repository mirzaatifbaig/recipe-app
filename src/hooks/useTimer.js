import { useState, useEffect, useRef } from "react";
import { useToast } from "./use-toast";

export function useTimer({ duration, onComplete, autoStart = false }) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const { toast } = useToast();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(duration);
    setIsRunning(false);
    setIsPaused(false);
  };

  const percentComplete = ((duration - timeRemaining) / duration) * 100;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);

            // Play sound and show toast when timer completes
            toast({
              title: "Timer Complete!",
              description: "Your cooking timer has finished.",
              variant: "default",
            });

            if (onComplete) {
              onComplete();
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onComplete, toast]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
    isPaused,
    percentComplete,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
