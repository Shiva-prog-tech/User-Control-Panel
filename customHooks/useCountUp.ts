"use client";

import { useEffect, useRef, useState } from "react";

// Animates a number towards `target` with an ease-out curve — used to make
// balances and totals "tick up" like a live terminal. Starts from 0 on mount,
// then animates between successive targets. Respects reduced-motion.
const useCountUp = (target: number, durationMs: number = 950): number => {
  const [value, setValue] = useState<number>(0);
  const fromRef = useRef<number>(0);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) {
      setValue(target);
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      fromRef.current = target;
      setValue(target);
      return;
    }

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
};

export default useCountUp;
