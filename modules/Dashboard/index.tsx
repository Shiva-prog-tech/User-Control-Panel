"use client";

import { useEffect, useState } from "react";
import Loader from "@/Components/Loader";
import { DashboardOverview } from "@/modules/Dashboard/types";
import { getDashboardOverview } from "@/services/dashboard.service";
import { formatCurrency } from "@/utils/helper";
import { CardsIcon, ClockIcon, TrendUpIcon } from "@/utils/ImageRelativePaths";
import AccountsPanel from "./components/AccountsPanel";
import QuickActions from "./components/QuickActions";
import SpendingTrend from "./components/SpendingTrend";
import StatCard from "./components/StatCard";
import TotalBalanceCard from "./components/TotalBalanceCard";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOverview = async () => {
      const data = await getDashboardOverview();
      if (!cancelled) {
        setOverview(data);
      }
    };

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!overview) {
    return <Loader fullPage label="Loading your overview" />;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.topGrid}>
        <TotalBalanceCard
          totalBalance={overview.totalBalance}
          accountBalance={overview.accountBalance}
          cardBalance={overview.cardBalance}
        />
        <QuickActions />
      </div>

      <div className={styles.statsRow}>
        <StatCard
          label="Monthly Spending"
          value={formatCurrency(overview.monthlySpending)}
          icon={TrendUpIcon}
          accent="teal"
        />
        <StatCard
          label="Active Cards"
          value={`${overview.activeCards} of ${overview.totalCards}`}
          icon={CardsIcon}
          accent="purple"
        />
        <StatCard
          label="Pending"
          value={formatCurrency(overview.pendingAmount)}
          icon={ClockIcon}
          accent="amber"
        />
      </div>

      <div className={styles.bottomGrid}>
        <SpendingTrend
          trend={overview.spendingTrend}
          sixMonthAverage={overview.sixMonthAverage}
          peakMonth={overview.peakMonth}
        />
        <AccountsPanel accounts={overview.accounts} />
      </div>
    </div>
  );
};

export default Dashboard;
