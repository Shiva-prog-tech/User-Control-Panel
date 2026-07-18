"use client";

import { useEffect, useState } from "react";
import Loader from "@/Components/Loader";
import { getAnalyticsSummary } from "@/services/analytics.service";
import { AnalyticsSummary } from "@/types/global";
import SummaryTiles from "./components/SummaryTiles";
import CategoryBreakdown from "./components/CategoryBreakdown";
import MonthlyComparison from "./components/MonthlyComparison";
import TrendLine from "./components/TrendLine";
import styles from "./Analytics.module.scss";

const Analytics = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchSummary = async () => {
      const data = await getAnalyticsSummary();
      if (active) {
        setSummary(data);
        setLoading(false);
      }
    };

    fetchSummary();

    return () => {
      active = false;
    };
  }, []);

  if (loading || !summary) {
    return <Loader fullPage label="Loading analytics..." />;
  }

  return (
    <div className={styles.analytics}>
      <header className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>Spend insights across your accounts</p>
      </header>
      <SummaryTiles
        totalSpent={summary.totalSpentThisMonth}
        totalIncome={summary.totalIncomeThisMonth}
      />
      <TrendLine trend={summary.trend} />
      <div className={styles.grid}>
        <CategoryBreakdown categories={summary.categories} />
        <MonthlyComparison data={summary.monthlyComparison} />
      </div>
    </div>
  );
};

export default Analytics;
