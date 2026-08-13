// Domain types owned by the Dashboard module.

import { Account } from "@/modules/Accounts/types";
import { SpendingTrendPoint } from "@/types/global";

export interface DashboardOverview {
  totalBalance: number;
  accountBalance: number;
  cardBalance: number;
  monthlySpending: number;
  activeCards: number;
  totalCards: number;
  pendingAmount: number;
  sixMonthAverage: number;
  peakMonth: SpendingTrendPoint;
  spendingTrend: SpendingTrendPoint[];
  accounts: Account[];
}
