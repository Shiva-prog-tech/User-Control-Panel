// Domain types owned by the Analytics module.

import { SpendingTrendPoint } from "@/types/global";

export interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlyComparisonPoint {
  month: string;
  spending: number;
  income: number;
}

export interface AnalyticsSummary {
  categories: CategorySpend[];
  monthlyComparison: MonthlyComparisonPoint[];
  trend: SpendingTrendPoint[];
  totalSpentThisMonth: number;
  totalIncomeThisMonth: number;
}
