"use client";

import { useCallback, useRef } from "react";
import { classNames } from "@/utils/helper";
import styles from "./TiltCard.module.scss";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees at the card's edge. */
  maxTilt?: number;
}

// Pointer-tracked 3D tilt + travelling glare, shared by every "floating"
// surface that should feel physical (stat cards, balance card, tiles).
// Purely presentational — wraps a single child without affecting layout.
const TiltCard = ({ children, className, maxTilt = 6 }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      node.style.setProperty(
        "--tilt-x",
        `${((px - 0.5) * maxTilt * 2).toFixed(2)}deg`
      );
      node.style.setProperty(
        "--tilt-y",
        `${((0.5 - py) * maxTilt * 1.4).toFixed(2)}deg`
      );
      node.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
      node.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
    },
    [maxTilt]
  );

  const handlePointerLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  }, []);

  return (
    <div
      ref={ref}
      className={classNames(styles.tilt, className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      {children}
      <span className={styles.glare} aria-hidden="true" />
    </div>
  );
};

export default TiltCard;
