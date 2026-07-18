"use client";

import { useMemo } from "react";
import AreaTrendChart from "@/Components/Charts/AreaTrendChart";
import LivePill from "@/Components/LivePill";
import { SpendingTrendPoint } from "@/types/global";
import { formatCurrency } from "@/utils/helper";
import styles from "./SpendingTrend.module.scss";

interface SpendingTrendProps {
  trend: SpendingTrendPoint[];
  sixMonthAverage: number;
  peakMonth: SpendingTrendPoint;
}

const SpendingTrend = ({
  trend,
  sixMonthAverage,
  peakMonth,
}: SpendingTrendProps) => {
  const points = useMemo(
    () =>
      trend.map((point) => ({ label: point.month, value: point.amount })),
    [trend]
  );

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Spending Trend</h2>
          <p className={styles.subtitle}>Last 6 months of real spend</p>
        </div>
        <LivePill />
      </div>

      <div className={styles.tiles}>
        <div className={styles.tile}>
          <span className={styles.tileLabel}>6M Average</span>
          <span className={styles.tileValue}>
            {formatCurrency(sixMonthAverage)}
          </span>
        </div>
        <div className={styles.tile}>
          <span className={styles.tileLabel}>Peak Month</span>
          <span className={styles.tileValue}>
            {peakMonth.month} · {formatCurrency(peakMonth.amount)}
          </span>
        </div>
      </div>

      <AreaTrendChart
        points={points}
        height={248}
        live
        ariaLabel={`Spending trend, peaking at ${formatCurrency(
          peakMonth.amount
        )} in ${peakMonth.month}`}
      />
    </section>
  );
};

export default SpendingTrend;
