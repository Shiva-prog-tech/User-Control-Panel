"use client";

import { MonthlyComparisonPoint } from "@/types/global";
import { formatCurrency } from "@/utils/helper";
import styles from "./MonthlyComparison.module.scss";

interface MonthlyComparisonProps {
  data: MonthlyComparisonPoint[];
}

const CHART_WIDTH = 520;
const CHART_HEIGHT = 220;
const PADDING_BOTTOM = 28;
const BAR_WIDTH = 18;
const BAR_GAP = 6;

const MonthlyComparison = ({ data }: MonthlyComparisonProps) => {
  const max = Math.max(
    1,
    ...data.map((point) => Math.max(point.spending, point.income))
  );
  const plotHeight = CHART_HEIGHT - PADDING_BOTTOM;
  const groupWidth = CHART_WIDTH / Math.max(1, data.length);

  const barHeight = (value: number) =>
    Math.max(2, (value / max) * (plotHeight - 12));

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.title}>Monthly comparison</h2>
        <span className={styles.subtitle}>Last 6 months</span>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.dotSpending} />
          Spending
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dotIncome} />
          Income
        </span>
      </div>

      <div className={styles.chartWrap}>
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className={styles.chart}
          role="img"
          aria-label={`Monthly spending vs income, peak ${formatCurrency(max)}`}
        >
          <line
            x1="0"
            y1={plotHeight}
            x2={CHART_WIDTH}
            y2={plotHeight}
            stroke="var(--color-border)"
            strokeWidth="1"
          />
          {data.map((point, index) => {
            const groupCenter = index * groupWidth + groupWidth / 2;
            const spendingHeight = barHeight(point.spending);
            const incomeHeight = barHeight(point.income);
            return (
              <g key={point.month}>
                <rect
                  x={groupCenter - BAR_WIDTH - BAR_GAP / 2}
                  y={plotHeight - spendingHeight}
                  width={BAR_WIDTH}
                  height={spendingHeight}
                  rx="4"
                  fill="#10b981"
                >
                  <title>
                    {point.month} spending: {formatCurrency(point.spending)}
                  </title>
                </rect>
                <rect
                  x={groupCenter + BAR_GAP / 2}
                  y={plotHeight - incomeHeight}
                  width={BAR_WIDTH}
                  height={incomeHeight}
                  rx="4"
                  fill="#8b5cf6"
                >
                  <title>
                    {point.month} income: {formatCurrency(point.income)}
                  </title>
                </rect>
                <text
                  x={groupCenter}
                  y={CHART_HEIGHT - 8}
                  textAnchor="middle"
                  className={styles.axisLabel}
                >
                  {point.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
};

export default MonthlyComparison;
