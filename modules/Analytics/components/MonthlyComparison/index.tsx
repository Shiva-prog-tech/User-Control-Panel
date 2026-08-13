"use client";

import { useEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import LivePill from "@/Components/LivePill";
import { createSwipeoRoot } from "@/libs/amchartsTheme";
import { MonthlyComparisonPoint } from "@/modules/Analytics/types";
import styles from "./MonthlyComparison.module.scss";

interface MonthlyComparisonProps {
  data: MonthlyComparisonPoint[];
}

// Clustered columns, rounded tops, animated rise — spending vs income.
const MonthlyComparison = ({ data }: MonthlyComparisonProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = chartRef.current;
    if (!element || data.length === 0) return;

    const chartData = data.map((point) => ({ ...point }));
    const root = createSwipeoRoot(element);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
        paddingRight: 4,
        layout: root.verticalLayout,
      })
    );
    chart.zoomOutButton.set("forceHidden", true);

    const xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 24,
      cellStartLocation: 0.15,
      cellEndLocation: 0.85,
    });
    xRenderer.grid.template.setAll({ visible: false });
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "month",
        renderer: xRenderer,
      })
    );
    xAxis.data.setAll(chartData);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.1,
        numberFormat: "'$'#a",
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    const makeSeries = (name: string, field: string, colorHex: number) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: field,
          categoryXField: "month",
          fill: am5.color(colorHex),
          stroke: am5.color(colorHex),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name} · {categoryX}: {valueY.formatNumber('$#,###.00')}",
          }),
        })
      );
      series.columns.template.setAll({
        cornerRadiusTL: 6,
        cornerRadiusTR: 6,
        maxWidth: 26,
        strokeOpacity: 0,
        width: am5.percent(88),
      });
      series.data.setAll(chartData);
      series.appear(1000);
      return series;
    };

    makeSeries("Spending", "spending", 0x10b981);
    makeSeries("Income", "income", 0x8b5cf6);

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 10,
      })
    );
    legend.labels.template.setAll({
      fontSize: 12.5,
      fontWeight: "600",
      fill: am5.color(0x1d1d1f),
    });
    legend.markers.template.setAll({ width: 10, height: 10 });
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 3,
      cornerRadiusTR: 3,
      cornerRadiusBL: 3,
      cornerRadiusBR: 3,
    });
    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);

    return () => root.dispose();
  }, [data]);

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Monthly comparison</h2>
          <span className={styles.subtitle}>Last 6 months</span>
        </div>
        <LivePill />
      </div>

      <div ref={chartRef} className={styles.chart} />
    </section>
  );
};

export default MonthlyComparison;
