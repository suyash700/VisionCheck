import { useEffect, useMemo, useState } from "react";

const DEFAULT_DURATION = 30;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const usePlateTimer = ({
  durationSeconds = DEFAULT_DURATION,
  plateKey,
  isActive = true,
  onExpire
}) => {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  useEffect(() => {
    setSecondsLeft(durationSeconds);
  }, [durationSeconds, plateKey]);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    if (secondsLeft <= 0) {
      onExpire?.();
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [secondsLeft, isActive, onExpire]);

  const progress = useMemo(
    () => clamp((secondsLeft / durationSeconds) * 100, 0, 100),
    [durationSeconds, secondsLeft]
  );

  return {
    secondsLeft,
    progress,
    reset: () => setSecondsLeft(durationSeconds)
  };
};

export default usePlateTimer;
