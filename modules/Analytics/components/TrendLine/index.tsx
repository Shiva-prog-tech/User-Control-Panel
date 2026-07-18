"use client";

import { useMemo } from "react";
import AreaTrendChart from "@/Components/Charts/AreaTrendChart";
import LivePill from "@/Components/LivePill";
import { SpendingTrendPoint } from "@/types/global";
import styles from "./TrendLine.module.scss";

interface TrendLineProps {
  trend: SpendingTrendPoint[];
}

// Full-width six-month trajectory with the live beacon on the newest month.
const TrendLine = ({ trend }: TrendLineProps) => {
  const points = useMemo(
    () => trend.map((point) => ({ label: point.month, value: point.amount })),
    [trend]
  );

  if (points.length === 0) return null;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Spending trend</h2>
          <span className={styles.subtitle}>
            Six-month trajectory across all accounts
          </span>
        </div>
        <LivePill />
      </div>
      <AreaTrendChart
        points={points}
        height={260}
        live
        ariaLabel="Six-month spending trend"
      />
    </section>
  );
};

export default TrendLine;
