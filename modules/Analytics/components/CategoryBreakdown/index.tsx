"use client";

import { useEffect, useMemo, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import LivePill from "@/Components/LivePill";
import { CHART_PALETTE, createSwipeoRoot } from "@/libs/amchartsTheme";
import { CategorySpend } from "@/modules/Analytics/types";
import { formatCurrency } from "@/utils/helper";
import styles from "./CategoryBreakdown.module.scss";

interface CategoryBreakdownProps {
  categories: CategorySpend[];
}

// Animated donut — slices pull out on hover, legend carries the percentages.
const CategoryBreakdown = ({ categories }: CategoryBreakdownProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const total = useMemo(
    () => categories.reduce((sum, item) => sum + item.amount, 0),
    [categories]
  );

  useEffect(() => {
    const element = chartRef.current;
    if (!element || categories.length === 0) return;

    const root = createSwipeoRoot(element);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(64),
        layout: root.verticalLayout,
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "amount",
        categoryField: "category",
        alignLabels: false,
      })
    );
    series.labels.template.set("forceHidden", true);
    series.ticks.template.set("forceHidden", true);
    series.slices.template.setAll({
      cornerRadius: 8,
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
      tooltipText:
        "{category}: {value.formatNumber('$#,###.00')} ({valuePercentTotal.formatNumber('#.0')}%)",
    });
    // Tactile pull-out on hover.
    series.slices.template.states.create("hover", {
      shiftRadius: 8,
      scale: 1.02,
    });
    series
      .get("colors")!
      .set(
        "colors",
        CHART_PALETTE.map((hex) => am5.color(hex))
      );

    // Month total in the donut's core.
    series.children.push(
      am5.Label.new(root, {
        text: `[bold fontSize:20px #1d1d1f]${formatCurrency(total)}[/]\n[fontSize:10.5px #86868b]THIS MONTH[/]`,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        textAlign: "center",
        populateText: false,
      })
    );

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 12,
        layout: am5.GridLayout.new(root, {
          maxColumns: 2,
          fixedWidthGrid: true,
        }),
      })
    );
    legend.labels.template.setAll({
      fontSize: 12.5,
      fontWeight: "600",
      fill: am5.color(0x1d1d1f),
    });
    legend.valueLabels.template.setAll({
      fontSize: 12.5,
      fill: am5.color(0x86868b),
      text: "{valuePercentTotal.formatNumber('#')}%",
    });
    legend.markers.template.setAll({ width: 10, height: 10 });
    legend.markerRectangles.template.setAll({
      cornerRadiusTL: 3,
      cornerRadiusTR: 3,
      cornerRadiusBL: 3,
      cornerRadiusBR: 3,
    });

    series.data.setAll(categories.map((item) => ({ ...item })));
    legend.data.setAll(series.dataItems);
    series.appear(1000, 100);

    return () => root.dispose();
  }, [categories, total]);

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <h2 className={styles.title}>Spending by category</h2>
        <LivePill />
      </div>
      {categories.length === 0 ? (
        <p className={styles.empty}>No spending recorded this month.</p>
      ) : (
        <div ref={chartRef} className={styles.chart} />
      )}
    </section>
  );
};

export default CategoryBreakdown;
