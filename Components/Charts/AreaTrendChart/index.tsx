"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { createSwipeoRoot } from "@/libs/amchartsTheme";
import styles from "./AreaTrendChart.module.scss";

export interface TrendChartPoint {
  label: string;
  value: number;
}

interface AreaTrendChartProps {
  points: TrendChartPoint[];
  height?: number;
  /** Pulsing beacon on the newest point + gentle value ticking every few seconds. */
  live?: boolean;
  color?: number;
  ariaLabel?: string;
}

const LIVE_TICK_MS = 4000;

// Smoothed emerald area chart — the app's signature "live" chart. One shared
// implementation so Dashboard, Analytics and Card details stay identical.
const AreaTrendChart = ({
  points,
  height = 240,
  live = true,
  color = 0x10b981,
  ariaLabel = "Trend chart",
}: AreaTrendChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const seriesRef = useRef<am5xy.SmoothedXLineSeries | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || points.length === 0) return;

    const data = points.map((point) => ({ ...point }));
    const lastLabel = data[data.length - 1]!.label;
    const accent = am5.color(color);

    const root = createSwipeoRoot(element);
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 0,
      })
    );
    chart.zoomOutButton.set("forceHidden", true);

    const xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 32 });
    xRenderer.grid.template.setAll({ visible: false });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "label",
        renderer: xRenderer,
      })
    );
    xAxis.data.setAll(data);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.18,
        numberFormat: "'$'#a",
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const series = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: "Trend",
        xAxis,
        yAxis,
        valueYField: "value",
        categoryXField: "label",
        stroke: accent,
        fill: accent,
        tension: 0.5,
        tooltip: am5.Tooltip.new(root, {
          labelText: "{categoryX} · {valueY.formatNumber('$#,###.00')}",
        }),
      })
    );
    series.strokes.template.setAll({ strokeWidth: 3 });
    series.fills.template.setAll({
      visible: true,
      fillGradient: am5.LinearGradient.new(root, {
        rotation: 90,
        stops: [
          { color: accent, opacity: 0.32 },
          { color: accent, opacity: 0 },
        ],
      }),
    });

    // Crisp dot on every point.
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 4,
          fill: am5.color(0xffffff),
          stroke: accent,
          strokeWidth: 2,
        }),
      })
    );

    // Radar-style pulse on the newest point — the "live" beacon.
    if (live) {
      series.bullets.push((_bulletRoot, _series, dataItem) => {
        const context = dataItem.dataContext as TrendChartPoint | undefined;
        if (!context || context.label !== lastLabel) return undefined;

        const halo = am5.Circle.new(root, {
          radius: 5,
          fill: accent,
          fillOpacity: 0.45,
        });
        halo.animate({
          key: "radius",
          from: 5,
          to: 18,
          duration: 1700,
          loops: Infinity,
          easing: am5.ease.out(am5.ease.cubic),
        });
        halo.animate({
          key: "fillOpacity",
          from: 0.45,
          to: 0,
          duration: 1700,
          loops: Infinity,
          easing: am5.ease.out(am5.ease.cubic),
        });
        return am5.Bullet.new(root, { sprite: halo });
      });
    }

    const cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, { behavior: "none" })
    );
    cursor.lineY.set("visible", false);
    cursor.lineX.setAll({
      stroke: accent,
      strokeOpacity: 0.4,
      strokeDasharray: [4, 4],
    });

    series.data.setAll(data);
    series.appear(1200);
    chart.appear(1000, 100);

    seriesRef.current = series;

    return () => {
      seriesRef.current = null;
      root.dispose();
    };
  }, [points, live, color]);

  // Gentle drift of the newest value so the chart reads as a live feed.
  useEffect(() => {
    if (!live || points.length === 0) return;

    const baseValue = points[points.length - 1]!.value;
    const interval = window.setInterval(() => {
      const series = seriesRef.current;
      if (!series || series.isDisposed()) return;
      const lastIndex = series.data.length - 1;
      if (lastIndex < 0) return;
      const current = series.data.getIndex(lastIndex) as TrendChartPoint;
      const drift = 1 + (Math.random() * 0.06 - 0.03);
      series.data.setIndex(lastIndex, {
        ...current,
        value: Math.max(0, Number((baseValue * drift).toFixed(2))),
      });
    }, LIVE_TICK_MS);

    return () => window.clearInterval(interval);
  }, [live, points]);

  return (
    <div
      ref={containerRef}
      className={styles.chart}
      style={{ height }}
      role="img"
      aria-label={ariaLabel}
    />
  );
};

export default AreaTrendChart;
