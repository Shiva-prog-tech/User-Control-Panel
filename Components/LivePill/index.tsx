"use client";

import styles from "./LivePill.module.scss";

interface LivePillProps {
  label?: string;
}

// Pulsing "LIVE" badge for chart headers — signals streaming data.
const LivePill = ({ label = "Live" }: LivePillProps) => (
  <span className={styles.pill}>
    <span className={styles.dot} />
    {label}
  </span>
);

export default LivePill;
