"use client";

import { SpendingTrendPoint } from "@/types/global";
import { formatCurrency } from "@/utils/helper";
import styles from "./SpendingTrend.module.scss";

interface SpendingTrendProps {
  trend: SpendingTrendPoint[];
  sixMonthAverage: number;
  peakMonth: SpendingTrendPoint;
}

const CHART_WIDTH = 640;
const CHART_HEIGHT = 220;
const PADDING_X = 16;
const PADDING_TOP = 18;
const PADDING_BOTTOM = 30;

const formatCompact = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `$${Math.round(value)}`;
};

const SpendingTrend = ({
  trend,
  sixMonthAverage,
  peakMonth,
}: SpendingTrendProps) => {
  const max = Math.max(1, ...trend.map((point) => point.amount));
  const plotWidth = CHART_WIDTH - PADDING_X * 2;
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const stepX = trend.length > 1 ? plotWidth / (trend.length - 1) : plotWidth;

  const pointAt = (index: number, amount: number) => ({
    x: PADDING_X + index * stepX,
    y: PADDING_TOP + (1 - amount / max) * plotHeight,
  });

  const points = trend.map((point, index) => pointAt(index, point.amount));
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? PADDING_X},${
    PADDING_TOP + plotHeight
  } L${PADDING_X},${PADDING_TOP + plotHeight} Z`;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.title}>Spending Trend</h2>
        <p className={styles.subtitle}>Last 6 months of real spend</p>
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

      <div className={styles.chartWrap}>
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className={styles.chart}
          role="img"
          aria-label={`Spending trend, peaking at ${formatCurrency(
            peakMonth.amount
          )} in ${peakMonth.month}`}
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1={PADDING_X}
            y1={PADDING_TOP}
            x2={CHART_WIDTH - PADDING_X}
            y2={PADDING_TOP}
            stroke="#c9d2e4"
            strokeWidth="1"
            strokeDasharray="5 6"
          />
          <text
            x={PADDING_X}
            y={PADDING_TOP - 6}
            className={styles.maxLabel}
          >
            {formatCompact(max)}
          </text>

          <path d={areaPath} fill="url(#trendFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={trend[index].month}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2"
              >
                <title>
                  {trend[index].month}: {formatCurrency(trend[index].amount)}
                </title>
              </circle>
              <text
                x={point.x}
                y={CHART_HEIGHT - 8}
                textAnchor="middle"
                className={styles.axisLabel}
              >
                {trend[index].month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
};

export default SpendingTrend;
