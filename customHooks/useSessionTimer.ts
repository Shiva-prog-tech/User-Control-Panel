"use client";

import { useEffect, useState } from "react";
import Config from "@/utils/Config";
import { formatCountdown } from "@/utils/helper";

// Counts down the remaining secure-session time (the "29:54" pill in the header).
const useSessionTimer = (
  totalMinutes: number = Config.SESSION_TIMEOUT_MINUTES
) => {
  const [secondsLeft, setSecondsLeft] = useState(totalMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    secondsLeft,
    formatted: formatCountdown(secondsLeft),
    expired: secondsLeft <= 0,
  };
};

export default useSessionTimer;
